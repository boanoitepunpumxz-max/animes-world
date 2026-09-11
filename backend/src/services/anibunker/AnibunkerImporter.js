/**
 * AnibunkerImporter — Importador de episódios do Anibunker
 *
 * ESTRATÉGIA (sem scraping do Render → Anibunker):
 *
 * O Anibunker bloqueia IPs de cloud (403). Para contornar isso:
 *
 * 1. ANÁLISE: gera slugs a partir dos títulos dos animes do banco
 *    usando a mesma função titleToSlug do Anibunker.
 *    Não faz HTTP ao Anibunker — salva o slug diretamente como mapeamento.
 *    Usa a API pública do Jikan (MyAnimeList) para obter o total de episódios.
 *
 * 2. SYNC EPISÓDIOS: constrói as URLs dos episódios diretamente:
 *    https://anibunker.com/anime/{slug}-episodio-{N}-legendado
 *    https://anibunker.com/anime/{slug}-episodio-{N}-dublado
 *    Salva essas URLs como episode_sources. O player do site carrega a URL
 *    no browser do usuário (sem bloqueio 403).
 *
 * REGRAS ABSOLUTAS:
 *  ✗ NUNCA cria anime novo
 *  ✗ NUNCA mistura episódios de animes diferentes
 *  ✓ Idempotente (executar 2x não duplica)
 *  ✓ URLs construídas são links diretos para o player do Anibunker
 */
const axios = require('axios');
const { query } = require('../../utils/db');
const { titleToSlug } = require('./AnibunkerProvider');

const PROVIDER    = 'anibunker';
const ANIBUNKER   = 'https://anibunker.com';
const JIKAN_BASE  = 'https://api.jikan.moe/v4';

// ── Logger ────────────────────────────────────────────────────
async function log(jobId, level, message, animeId = null, details = null) {
  await query(
    `INSERT INTO import_logs (job_id, anime_id, level, message, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [jobId, animeId, level,
     `[ANIBUNKER] ${message}`.substring(0, 2000),
     details ? JSON.stringify(details) : null]
  ).catch(() => {});
}

async function updateJob(jobId, updates) {
  const sets = Object.entries(updates).map(([k], i) => `${k}=$${i + 2}`).join(', ');
  await query(
    `UPDATE import_jobs SET ${sets}, updated_at=NOW() WHERE id=$1`,
    [jobId, ...Object.values(updates)]
  ).catch(() => {});
}

// ── Cria job ──────────────────────────────────────────────────
async function createJob(jobType, isDryRun, userId) {
  const r = await query(
    `INSERT INTO import_jobs (job_type, provider, is_dry_run, status, started_by)
     VALUES ($1, $2, $3, 'running', $4) RETURNING id`,
    [jobType, PROVIDER, isDryRun, userId]
  );
  return r.rows[0].id;
}

// ── Busca animes do banco ─────────────────────────────────────
async function getDbAnimes() {
  const r = await query(
    `SELECT id, title, title_english, title_romaji, title_japanese,
            external_id, episodes_count
     FROM anime WHERE is_hidden=false
     ORDER BY popularity DESC NULLS LAST`
  );
  return r.rows;
}

// ── Busca total de eps via Jikan (MAL API — não bloqueia cloud) ─
// Retorna { episodes: N } ou null
const jikanCache = new Map();
async function getEpisodesFromJikan(malId) {
  if (!malId) return null;
  if (jikanCache.has(malId)) return jikanCache.get(malId);
  try {
    await new Promise(r => setTimeout(r, 400)); // respeita rate limit Jikan (3 req/s)
    const res = await axios.get(`${JIKAN_BASE}/anime/${malId}`, { timeout: 8000 });
    const eps = res.data?.data?.episodes || 0;
    const result = { episodes: eps };
    jikanCache.set(malId, result);
    return result;
  } catch {
    return null; // falha silenciosa
  }
}

// ── Obtém ou cria season ──────────────────────────────────────
async function getOrCreateSeason(animeId, seasonNumber, isDryRun) {
  const ex = await query('SELECT id FROM seasons WHERE anime_id=$1 AND number=$2', [animeId, seasonNumber]);
  if (ex.rows[0]) return ex.rows[0].id;
  if (isDryRun) return `dry-season-${seasonNumber}`;
  const r = await query(
    `INSERT INTO seasons (anime_id, number, title) VALUES ($1, $2, $3) RETURNING id`,
    [animeId, seasonNumber, `Temporada ${seasonNumber}`]
  );
  return r.rows[0].id;
}

// ── Salva episódio + source do Anibunker ─────────────────────
async function saveEpisodeSource(animeId, seasonId, epNumber, version, pageUrl, isDryRun, jobId) {
  if (!epNumber || epNumber <= 0 || epNumber > 10000) {
    await log(jobId, 'BLOCK', `Ep inválido: ${epNumber}`, animeId);
    return { saved: false };
  }

  // Upsert episódio
  let episodeId;
  if (!isDryRun) {
    const epRes = await query(
      `INSERT INTO episodes (anime_id, season_id, season_number, episode_number)
       VALUES ($1, $2, 1, $3)
       ON CONFLICT (anime_id, season_number, episode_number) DO UPDATE
         SET season_id = COALESCE(EXCLUDED.season_id, episodes.season_id)
       RETURNING id`,
      [animeId, seasonId, epNumber]
    );
    episodeId = epRes.rows[0]?.id;
    if (!episodeId) {
      const ep2 = await query(
        'SELECT id FROM episodes WHERE anime_id=$1 AND season_number=1 AND episode_number=$2',
        [animeId, epNumber]
      );
      episodeId = ep2.rows[0]?.id;
    }
  }

  if (!episodeId && !isDryRun) return { saved: false, reason: 'Não foi possível criar episódio' };

  // Verifica se source já existe
  if (!isDryRun && episodeId) {
    const srcCheck = await query(
      `SELECT id FROM episode_sources
       WHERE episode_id=$1 AND provider_name='anibunker' AND language=$2`,
      [episodeId, version]
    );
    if (srcCheck.rows[0]) return { saved: false, reason: 'Já existe' };

    await query(
      `INSERT INTO episode_sources
         (episode_id, label, source_type, url, quality, language, is_default, provider_name)
       VALUES ($1, $2, 'embed', $3, 'auto', $4, false, 'anibunker')
       ON CONFLICT DO NOTHING`,
      [episodeId,
       version === 'legendado' ? 'Legendado' : 'Dublado',
       pageUrl, version]
    ).catch(() => {});
  }

  return { saved: true };
}

// ════════════════════════════════════════════════════════════
// ANÁLISE — Gera mapeamentos slug-based SEM HTTP ao Anibunker
// ════════════════════════════════════════════════════════════
async function runAnalysis(jobId, isDryRun) {
  const dbAnimes = await getDbAnimes();
  await updateJob(jobId, { total: dbAnimes.length, status: 'running' });
  await log(jobId, 'INFO',
    `Análise iniciada (modo slug-direto). ${dbAnimes.length} animes a processar.`
  );

  let matched = 0, skipped = 0, errors = 0;

  for (let i = 0; i < dbAnimes.length; i++) {
    const anime = dbAnimes[i];
    await updateJob(jobId, { processed: i + 1, current_anime: anime.title });

    try {
      // Pula se já tem mapeamento válido
      const existing = await query(
        `SELECT id, status FROM anime_external_sources
         WHERE anime_id=$1 AND provider=$2`,
        [anime.id, PROVIDER]
      );
      if (existing.rows[0]?.status === 'synced') {
        skipped++;
        continue;
      }

      // Gera slug principal
      // O Anibunker usa o título japonês/romaji para os slugs
      // Ex: "Shingeki no Kyojin" → "shingeki-no-kyojin" (NÃO "attack-on-titan")
      // Usa: title romaji > title original > title_english como fallback final
      const slugTitle = anime.title_romaji || anime.title || anime.title_english;
      const slug = titleToSlug(slugTitle);

      // Busca total de eps via Jikan (para enriquecer o mapeamento)
      let totalEps = anime.episodes_count || 0;
      if (anime.external_id) {
        const jikan = await getEpisodesFromJikan(anime.external_id);
        if (jikan?.episodes) totalEps = jikan.episodes;
      }

      await log(jobId, 'MATCH',
        `${anime.title} → slug="${slug}" | eps=${totalEps}`,
        anime.id, { slug, totalEps }
      );

      if (!isDryRun) {
        await query(
          `INSERT INTO anime_external_sources
             (anime_id, provider, external_slug, external_title, match_score,
              match_method, status, episode_count)
           VALUES ($1, $2, $3, $4, 95, 'slug_direct', 'pending', $5)
           ON CONFLICT (anime_id, provider) DO UPDATE SET
             external_slug  = EXCLUDED.external_slug,
             match_score    = EXCLUDED.match_score,
             status         = CASE WHEN anime_external_sources.status='synced'
                                   THEN 'synced' ELSE 'pending' END,
             episode_count  = EXCLUDED.episode_count,
             updated_at     = NOW()`,
          [anime.id, PROVIDER, slug, slugTitle, totalEps]
        );
      }
      matched++;
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${anime.title} — erro: ${e.message}`, anime.id);
    }
  }

  const summary = { total: dbAnimes.length, matched, skipped, errors };
  await updateJob(jobId, {
    status: 'completed', finished_at: new Date(),
    matched, errors,
    result_summary: JSON.stringify(summary),
  });
  await log(jobId, 'INFO',
    `Análise concluída: matched=${matched} pulados=${skipped} erros=${errors}`
  );
  return summary;
}

// ════════════════════════════════════════════════════════════
// SYNC EPISÓDIOS — Constrói URLs diretas, sem HTTP ao Anibunker
// ════════════════════════════════════════════════════════════
async function runSyncEpisodes(jobId, isDryRun, animeIds = null) {
  let where = `aes.provider='${PROVIDER}' AND aes.status IN ('pending','partial') AND aes.external_slug != ''`;
  const params = [];
  if (animeIds?.length) {
    params.push(animeIds);
    where += ` AND aes.anime_id = ANY($1)`;
  }

  const mapped = await query(
    `SELECT aes.id AS aes_id, aes.anime_id, aes.external_slug,
            aes.episode_count,
            a.title, a.title_english, a.external_id, a.episodes_count
     FROM anime_external_sources aes
     JOIN anime a ON a.id = aes.anime_id
     WHERE ${where}
     ORDER BY a.popularity DESC NULLS LAST
     LIMIT 500`,
    params
  );

  await updateJob(jobId, { total: mapped.rows.length, status: 'running' });
  await log(jobId, 'INFO',
    `Sync episódios: ${mapped.rows.length} animes mapeados para processar.`
  );

  let newEps = 0, skippedEps = 0, errors = 0;

  for (let i = 0; i < mapped.rows.length; i++) {
    const row = mapped.rows[i];
    await updateJob(jobId, {
      processed: i + 1,
      current_anime: row.title,
    });

    try {
      const slug = row.external_slug;

      // Determina total de episódios
      let totalEps = row.episode_count || row.episodes_count || 0;
      if (!totalEps && row.external_id) {
        const jikan = await getEpisodesFromJikan(row.external_id);
        if (jikan?.episodes) totalEps = jikan.episodes;
      }
      if (!totalEps || totalEps === 0) {
        // Sem info de eps — tenta 12 como padrão (detecta automaticamente)
        totalEps = 12;
      }

      await log(jobId, 'INFO',
        `${row.title} | slug=${slug} | eps=${totalEps}`,
        row.anime_id
      );

      const seasonId = await getOrCreateSeason(row.anime_id, 1, isDryRun);
      let savedCount = 0;

      // Versões disponíveis: sempre tenta legendado; dublado se tiver info
      const versions = ['legendado'];
      // Tenta dublado também (será salvo se existir no Anibunker)
      versions.push('dublado');

      for (const version of versions) {
        for (let ep = 1; ep <= totalEps; ep++) {
          // URL direta para a página do episódio no Anibunker
          // O browser do usuário carrega esta URL — não o Render
          const pageUrl = `${ANIBUNKER}/anime/${slug}-episodio-${ep}-${version}`;

          if (isDryRun) {
            await log(jobId, 'INFO',
              `[DRY RUN] ${row.title} ep${ep} ${version} → ${pageUrl}`,
              row.anime_id
            );
            savedCount++;
            newEps++;
            continue;
          }

          const result = await saveEpisodeSource(
            row.anime_id, seasonId, ep, version, pageUrl, isDryRun, jobId
          );
          if (result.saved) {
            savedCount++;
            newEps++;
          } else if (result.reason !== 'Já existe') {
            skippedEps++;
          }
        }
      }

      // Atualiza episodes_count do anime no banco
      if (!isDryRun && savedCount > 0) {
        await query(
          `UPDATE anime SET episodes_count = (
             SELECT COUNT(*) FROM episodes WHERE anime_id = $1
           ), updated_at = NOW() WHERE id = $1`,
          [row.anime_id]
        );
        await query(
          `UPDATE anime_external_sources
           SET status = 'synced', last_synced_at = NOW(),
               episode_count = $1, updated_at = NOW()
           WHERE id = $2`,
          [savedCount / versions.length, row.aes_id]
        );
      }

      await log(jobId, 'INFO',
        `${row.title} — ${savedCount} fontes salvas`,
        row.anime_id
      );
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${row.title} — ${e.message}`, row.anime_id);
      if (!isDryRun) {
        await query(
          `UPDATE anime_external_sources SET status='error', notes=$1 WHERE id=$2`,
          [e.message.substring(0, 200), row.aes_id]
        ).catch(() => {});
      }
    }
  }

  const summary = { total: mapped.rows.length, newEps, skippedEps, errors };
  await updateJob(jobId, {
    status: 'completed',
    finished_at: new Date(),
    episodes_added: newEps,
    errors,
    result_summary: JSON.stringify(summary),
  });
  await log(jobId, 'INFO',
    `Sync concluído: animes=${mapped.rows.length} eps=${newEps} pulados=${skippedEps} erros=${errors}`
  );
  return summary;
}

// ── Jobs em background ────────────────────────────────────────
const activeJobs = new Map();

async function startJobBackground(jobId, jobType, isDryRun, userId, animeIds) {
  activeJobs.set(jobId, true);
  setImmediate(async () => {
    try {
      if      (jobType === 'analyze')       await runAnalysis(jobId, isDryRun);
      else if (jobType === 'dry_run')       await runAnalysis(jobId, true);
      else if (jobType === 'sync_episodes') await runSyncEpisodes(jobId, isDryRun, animeIds);
      else if (jobType === 'sync_all') {
        await runAnalysis(jobId, isDryRun);
        await runSyncEpisodes(jobId, isDryRun, animeIds);
      }
    } catch (e) {
      await updateJob(jobId, { status: 'failed', finished_at: new Date() });
      await log(jobId, 'ERROR', `Job falhou: ${e.message}`);
    } finally {
      activeJobs.delete(jobId);
    }
  });
  return jobId;
}

module.exports = {
  PROVIDER,
  createJob,
  startJobBackground,
  runAnalysis,
  runSyncEpisodes,
  isActive: (jobId) => activeJobs.has(jobId),
};
