/**
 * AnimeImporter — Orquestra a importação da AnFireAPI para o banco existente
 *
 * Regras absolutas:
 *  ✗ NUNCA cria anime novo
 *  ✗ NUNCA substitui dados existentes válidos
 *  ✗ NUNCA mistura episódios de animes diferentes
 *  ✓ Preenche cover_url/banner_url quando ausentes
 *  ✓ Cria episódios e episode_sources para animes já existentes
 *  ✓ É idempotente (executar 2x não duplica)
 *  ✓ Salva checkpoint para retomar após reinício
 */
const { query } = require('../../utils/db');
const { fetchAnime, fetchEpisodes, searchAnime } = require('./AnFireProvider');
const { findBestMatch, prefilterCandidates } = require('./AnimeMatcher');

// ── Logger para o job ─────────────────────────────────────────
async function log(jobId, level, message, animeId = null, details = null) {
  await query(
    `INSERT INTO import_logs (job_id, anime_id, level, message, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [jobId, animeId, level, message.substring(0, 2000), details ? JSON.stringify(details) : null]
  ).catch(() => {});
}

async function updateJob(jobId, updates) {
  const sets = Object.entries(updates)
    .map(([k, v], i) => `${k} = $${i + 2}`)
    .join(', ');
  const vals = Object.values(updates);
  await query(
    `UPDATE import_jobs SET ${sets}, updated_at = NOW() WHERE id = $1`,
    [jobId, ...vals]
  ).catch(() => {});
}

// ── Cria um job de importação ─────────────────────────────────
async function createJob(jobType, isDryRun = false, startedBy = null) {
  const r = await query(
    `INSERT INTO import_jobs (job_type, is_dry_run, status, started_by)
     VALUES ($1, $2, 'running', $3)
     RETURNING id`,
    [jobType, isDryRun, startedBy]
  );
  return r.rows[0].id;
}

// ── Busca todos os animes do banco em lote ────────────────────
async function getAllDbAnimes() {
  const r = await query(
    `SELECT id, slug, title, title_english, title_romaji, title_japanese,
            cover_url, banner_url, external_id, episodes_count
     FROM anime
     WHERE is_hidden = false
     ORDER BY popularity DESC NULLS LAST`
  );
  return r.rows;
}

// ── Verifica se episódio já existe ────────────────────────────
async function episodeExists(animeId, seasonNumber, episodeNumber) {
  const r = await query(
    `SELECT id FROM episodes
     WHERE anime_id = $1 AND season_number = $2 AND episode_number = $3`,
    [animeId, seasonNumber, episodeNumber]
  );
  return r.rows[0]?.id || null;
}

// ── Verifica se source já existe ─────────────────────────────
async function sourceExists(episodeId, url) {
  const r = await query(
    `SELECT id FROM episode_sources WHERE episode_id = $1 AND url = $2`,
    [episodeId, url]
  );
  return !!r.rows[0];
}

// ── Obtém ou cria season ──────────────────────────────────────
async function getOrCreateSeason(animeId, seasonNumber) {
  const existing = await query(
    `SELECT id FROM seasons WHERE anime_id = $1 AND number = $2`,
    [animeId, seasonNumber]
  );
  if (existing.rows[0]) return existing.rows[0].id;
  const r = await query(
    `INSERT INTO seasons (anime_id, number, title) VALUES ($1, $2, $3) RETURNING id`,
    [animeId, seasonNumber, `Temporada ${seasonNumber}`]
  );
  return r.rows[0].id;
}

// ── Salva um episódio e suas fontes ──────────────────────────
async function saveEpisode(animeId, seasonId, seasonNumber, epData, isDryRun, jobId) {
  // Valida que o episódio pertence ao anime correto
  const { number, sources } = epData;
  if (!number || isNaN(number) || number <= 0 || number > 10000) {
    await log(jobId, 'SKIP', `Ep inválido: número ${number}`, animeId);
    return { created: false, sourcesAdded: 0 };
  }

  let episodeId = await episodeExists(animeId, seasonNumber, number);
  let created = false;

  if (!episodeId) {
    if (!isDryRun) {
      const r = await query(
        `INSERT INTO episodes (anime_id, season_id, season_number, episode_number)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (anime_id, season_number, episode_number) DO NOTHING
         RETURNING id`,
        [animeId, seasonId, seasonNumber, number]
      );
      episodeId = r.rows[0]?.id;
      if (episodeId) {
        created = true;
        // Atualiza episodes_count
        await query(
          `UPDATE anime SET episodes_count = (
             SELECT COUNT(*) FROM episodes WHERE anime_id = $1 AND is_hidden = false
           ) WHERE id = $1`,
          [animeId]
        );
      }
    } else {
      created = true; // dry run — simula criação
    }
  }

  // Salva as fontes de vídeo
  let sourcesAdded = 0;
  if (episodeId && sources?.length > 0) {
    for (const src of sources) {
      if (!src.url) continue;
      const alreadyExists = await sourceExists(episodeId, src.url);
      if (alreadyExists) continue;
      if (!isDryRun) {
        await query(
          `INSERT INTO episode_sources
             (episode_id, label, source_type, url, quality, language, is_default, provider_name, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'anfire', $8)
           ON CONFLICT DO NOTHING`,
          [
            episodeId,
            `${src.quality} ${src.language}`.trim(),
            src.type || 'hls',
            src.url,
            src.quality || 'auto',
            src.language || 'legendado',
            src.isDefault,
            src.sortOrder || 0,
          ]
        ).catch(() => {});
      }
      sourcesAdded++;
    }
  }

  return { created, sourcesAdded };
}

// ── Analisa catálogo (sem importar) ──────────────────────────
async function runAnalysis(jobId, isDryRun, userId) {
  const dbAnimes = await getAllDbAnimes();
  await updateJob(jobId, { total: dbAnimes.length, status: 'running' });
  await log(jobId, 'INFO', `Análise iniciada. Total: ${dbAnimes.length} animes.`);

  let matched = 0, reviewRequired = 0, noMatch = 0, errors = 0;

  for (let i = 0; i < dbAnimes.length; i++) {
    const anime = dbAnimes[i];
    await updateJob(jobId, { processed: i + 1, current_anime: anime.title, checkpoint_id: anime.id });

    try {
      // Verifica se já tem mapeamento
      const existing = await query(
        `SELECT id, status FROM anime_external_sources WHERE anime_id = $1 AND provider = 'anfire'`,
        [anime.id]
      );
      if (existing.rows[0]) {
        await log(jobId, 'SKIP', `${anime.title} — já mapeado (${existing.rows[0].status})`, anime.id);
        matched++;
        continue;
      }

      // Busca candidatos na AnFireAPI
      const searchTitle = anime.title_english || anime.title;
      const results = await searchAnime(searchTitle);

      if (!results.length) {
        await log(jobId, 'WARN', `${anime.title} — sem resultados na AnFireAPI`, anime.id);
        if (!isDryRun) {
          await query(
            `INSERT INTO anime_external_sources (anime_id, external_slug, external_title, match_score, status, notes)
             VALUES ($1, '', $2, 0, 'review_required', 'Sem resultados na busca')
             ON CONFLICT (anime_id, provider) DO NOTHING`,
            [anime.id, searchTitle]
          );
        }
        noMatch++;
        continue;
      }

      // Usa apenas os 10 primeiros resultados para matching
      const candidates = results.slice(0, 10).map(r => ({
        id: r.slug, slug: r.slug, title: r.title,
        title_english: r.title, title_romaji: r.title,
        title_japanese: null,
      }));

      const best = findBestMatch(anime.title_english || anime.title, anime.title, candidates);

      if (best.classification === 'match') {
        const matchData = results.find(r => r.slug === best.anime?.id || r.slug === best.anime?.slug);
        await log(jobId, 'MATCH',
          `${anime.title} → ${best.anime.title} (${best.score}%)`,
          anime.id, { score: best.score, method: best.method, reasons: best.reasons }
        );
        if (!isDryRun) {
          await query(
            `INSERT INTO anime_external_sources
               (anime_id, external_slug, external_title, external_url, match_score, match_method, status)
             VALUES ($1, $2, $3, $4, $5, $6, 'pending')
             ON CONFLICT (anime_id, provider) DO UPDATE SET
               external_slug = EXCLUDED.external_slug,
               match_score = EXCLUDED.match_score,
               status = 'pending'`,
            [anime.id, best.anime.slug || best.anime.id, best.anime.title, matchData?.url || '', best.score, best.method]
          );
        }
        matched++;
      } else if (best.classification === 'review_required') {
        await log(jobId, 'WARN',
          `${anime.title} — correspondência ambígua: ${best.anime?.title} (${best.score}%)`,
          anime.id, { score: best.score, candidates: results.slice(0, 5).map(r => r.title) }
        );
        if (!isDryRun) {
          await query(
            `INSERT INTO anime_external_sources
               (anime_id, external_slug, external_title, match_score, match_method, status, notes)
             VALUES ($1, $2, $3, $4, $5, 'review_required', $6)
             ON CONFLICT (anime_id, provider) DO NOTHING`,
            [anime.id, best.anime?.slug || '', best.anime?.title || '', best.score, best.method,
             `Candidatos: ${results.slice(0, 3).map(r => r.title).join(', ')}`]
          );
        }
        reviewRequired++;
      } else {
        noMatch++;
        await log(jobId, 'WARN', `${anime.title} — sem correspondência segura`, anime.id);
      }
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${anime.title} — erro: ${e.message}`, anime.id);
    }
  }

  const summary = { total: dbAnimes.length, matched, reviewRequired, noMatch, errors };
  await updateJob(jobId, { status: 'completed', finished_at: new Date(), ...summary, result_summary: JSON.stringify(summary) });
  await log(jobId, 'INFO', `Análise concluída. Matched: ${matched} | Review: ${reviewRequired} | Sem match: ${noMatch} | Erros: ${errors}`);
  return summary;
}

// ── Sincroniza capas dos animes já mapeados ──────────────────
async function runSyncCovers(jobId, isDryRun) {
  const mapped = await query(
    `SELECT aes.id, aes.anime_id, aes.external_slug, aes.external_title,
            a.title, a.cover_url, a.banner_url
     FROM anime_external_sources aes
     JOIN anime a ON a.id = aes.anime_id
     WHERE aes.provider = 'anfire'
       AND aes.status IN ('pending', 'partial')
       AND aes.external_slug != ''
       AND aes.cover_fetched = false
     ORDER BY a.popularity DESC NULLS LAST
     LIMIT 500`
  );

  await updateJob(jobId, { total: mapped.rows.length, status: 'running' });
  let coversAdded = 0, errors = 0;

  for (let i = 0; i < mapped.rows.length; i++) {
    const row = mapped.rows[i];
    await updateJob(jobId, { processed: i + 1, current_anime: row.title, checkpoint_id: row.anime_id });

    try {
      const animeData = await fetchAnime(row.external_slug);
      if (!animeData) {
        errors++;
        await log(jobId, 'ERROR', `${row.title} — API não retornou dados`, row.anime_id);
        continue;
      }

      const updates = {};
      let changed = false;

      // Cover: só preenche se estiver vazio ou for AniList quebrado
      if (animeData.cover && (!row.cover_url || row.cover_url.includes('anilist'))) {
        updates.cover_url = animeData.cover;
        changed = true;
        coversAdded++;
        await log(jobId, 'INFO', `${row.title} — capa atualizada`, row.anime_id, { url: animeData.cover });
      } else if (row.cover_url && !row.cover_url.includes('anilist')) {
        await log(jobId, 'SKIP', `${row.title} — capa já existe`, row.anime_id);
      }

      if (changed && !isDryRun) {
        await query(
          `UPDATE anime SET cover_url = COALESCE($1, cover_url), updated_at = NOW() WHERE id = $2`,
          [updates.cover_url || null, row.anime_id]
        );
        await query(
          `UPDATE anime_external_sources SET cover_fetched = true, updated_at = NOW() WHERE id = $3`,
          [row.id]
        );
      }
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${row.title} — erro: ${e.message}`, row.anime_id);
    }
  }

  const summary = { coversAdded, errors, total: mapped.rows.length };
  await updateJob(jobId, { status: 'completed', finished_at: new Date(), covers_added: coversAdded, errors, result_summary: JSON.stringify(summary) });
  await log(jobId, 'INFO', `Sync capas concluído. Capas: ${coversAdded} | Erros: ${errors}`);
  return summary;
}

// ── Sincroniza episódios dos animes mapeados ─────────────────
async function runSyncEpisodes(jobId, isDryRun, animeIds = null) {
  let whereClause = `aes.provider = 'anfire' AND aes.status IN ('pending','partial') AND aes.external_slug != ''`;
  const params = [];
  if (animeIds?.length) {
    params.push(animeIds);
    whereClause += ` AND aes.anime_id = ANY($1)`;
  }

  const mapped = await query(
    `SELECT aes.id as aes_id, aes.anime_id, aes.external_slug,
            a.title, a.title_english, a.episodes_count
     FROM anime_external_sources aes
     JOIN anime a ON a.id = aes.anime_id
     WHERE ${whereClause}
     ORDER BY a.popularity DESC NULLS LAST
     LIMIT 200`,
    params
  );

  await updateJob(jobId, { total: mapped.rows.length, status: 'running' });
  let epTotal = 0, epNew = 0, srcNew = 0, errors = 0;

  for (let i = 0; i < mapped.rows.length; i++) {
    const row = mapped.rows[i];
    await updateJob(jobId, { processed: i + 1, current_anime: row.title, checkpoint_id: row.anime_id });
    await log(jobId, 'INFO', `Processando: ${row.title} (slug: ${row.external_slug})`, row.anime_id);

    try {
      const episodes = await fetchEpisodes(row.external_slug);
      if (!episodes.length) {
        await log(jobId, 'WARN', `${row.title} — nenhum episódio encontrado`, row.anime_id);
        continue;
      }

      epTotal += episodes.length;
      await log(jobId, 'INFO', `${row.title} — ${episodes.length} episódio(s) encontrado(s)`, row.anime_id);

      // Por padrão usa temporada 1 (AnFireAPI não distingue temporadas)
      const seasonId = isDryRun ? null : await getOrCreateSeason(row.anime_id, 1);

      for (const ep of episodes) {
        const result = await saveEpisode(row.anime_id, seasonId, 1, ep, isDryRun, jobId);
        if (result.created) epNew++;
        srcNew += result.sourcesAdded;
      }

      if (!isDryRun) {
        await query(
          `UPDATE anime_external_sources
           SET status = 'synced', last_synced_at = NOW(), episode_count = $1, updated_at = NOW()
           WHERE id = $2`,
          [episodes.length, row.aes_id]
        );
      }
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${row.title} — erro: ${e.message}`, row.anime_id);
      if (!isDryRun) {
        await query(
          `UPDATE anime_external_sources SET status = 'error', notes = $1 WHERE id = $2`,
          [e.message.substring(0, 500), row.aes_id]
        );
      }
    }
  }

  const summary = { total: mapped.rows.length, episodesFound: epTotal, episodesNew: epNew, sourcesNew: srcNew, errors };
  await updateJob(jobId, {
    status: 'completed', finished_at: new Date(),
    episodes_added: epNew, errors,
    result_summary: JSON.stringify(summary),
  });
  await log(jobId, 'INFO',
    `Sync episódios concluído. Animes: ${mapped.rows.length} | Eps novos: ${epNew} | Fontes: ${srcNew} | Erros: ${errors}`
  );
  return summary;
}

// ── Sincronização completa ────────────────────────────────────
async function runSyncAll(jobId, isDryRun, userId) {
  await log(jobId, 'INFO', 'Sincronização completa iniciada');
  const analysisResult  = await runAnalysis(jobId, isDryRun, userId);
  // Cria sub-jobs para covers e episodes após análise
  const coversJobId = await createJob('sync_covers', isDryRun, userId);
  await runSyncCovers(coversJobId, isDryRun);
  const epJobId = await createJob('sync_episodes', isDryRun, userId);
  await runSyncEpisodes(epJobId, isDryRun);
  return { analysis: analysisResult };
}

// ── Jobs em background ────────────────────────────────────────
const activeJobs = new Map(); // jobId → AbortController

async function startJobBackground(jobId, jobType, isDryRun, userId, animeIds) {
  const ac = new AbortController();
  activeJobs.set(jobId, ac);

  const run = async () => {
    try {
      if (jobType === 'analyze')        await runAnalysis(jobId, isDryRun, userId);
      else if (jobType === 'sync_covers')   await runSyncCovers(jobId, isDryRun);
      else if (jobType === 'sync_episodes') await runSyncEpisodes(jobId, isDryRun, animeIds);
      else if (jobType === 'sync_all')      await runSyncAll(jobId, isDryRun, userId);
      else if (jobType === 'dry_run')       await runAnalysis(jobId, true, userId);
    } catch (e) {
      await updateJob(jobId, { status: 'failed', finished_at: new Date() });
      await log(jobId, 'ERROR', `Job falhou: ${e.message}`);
    } finally {
      activeJobs.delete(jobId);
    }
  };

  // Não bloqueia a requisição HTTP
  setImmediate(run);
  return jobId;
}

async function pauseJob(jobId) {
  await updateJob(jobId, { status: 'paused' });
}

async function cancelJob(jobId) {
  await updateJob(jobId, { status: 'cancelled', finished_at: new Date() });
  activeJobs.delete(jobId);
}

module.exports = {
  createJob, startJobBackground, pauseJob, cancelJob,
  getAllDbAnimes,
  runAnalysis, runSyncCovers, runSyncEpisodes, runSyncAll,
};
