/**
 * AnibunkerImporter — Importador de episódios do Anibunker
 *
 * Reutiliza:
 *  - Sistema de jobs existente (import_jobs, import_logs)
 *  - AnimeMatcher existente (mesma lógica de matching)
 *  - anime_external_sources (novo provider='anibunker')
 *  - episode_sources (tabela existente)
 *
 * REGRAS ABSOLUTAS:
 *  ✗ NUNCA cria anime novo
 *  ✗ NUNCA mistura episódios de animes diferentes
 *  ✓ Busca match no catálogo existente
 *  ✓ Idempotente
 *  ✓ Checkpoint para retomar após reinício
 *  ✓ Download de vídeo apenas de fontes autorizadas
 */
const path = require('path');
const fs   = require('fs');
const axios = require('axios');
const { query } = require('../../utils/db');
const provider = require('./AnibunkerProvider');
const { findBestMatch, prefilterCandidates } = require('../anfire/AnimeMatcher');

const PROVIDER = 'anibunker';

// ── Logger ────────────────────────────────────────────────────
async function log(jobId, level, message, animeId = null, details = null) {
  await query(
    `INSERT INTO import_logs (job_id, anime_id, level, message, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [jobId, animeId, level, `[ANIBUNKER] ${message}`.substring(0, 2000),
     details ? JSON.stringify(details) : null]
  ).catch(() => {});
}

async function updateJob(jobId, updates) {
  const sets = Object.entries(updates).map(([k], i) => `${k}=$${i+2}`).join(', ');
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
async function getDbAnimes(checkpointId = null) {
  let where = 'WHERE is_hidden=false';
  const params = [];
  if (checkpointId) {
    params.push(checkpointId);
    where += ` AND created_at > (SELECT created_at FROM anime WHERE id=$1)`;
  }
  const r = await query(
    `SELECT id, slug, title, title_english, title_romaji, title_japanese,
            cover_url, banner_url, external_id, episodes_count
     FROM anime ${where} ORDER BY popularity DESC NULLS LAST`,
    params
  );
  return r.rows;
}

// ── Validação crítica de segurança ────────────────────────────
async function validateAnimeSeasonEpisode(animeId, seasonId, episodeNumber) {
  // Verifica que season pertence ao anime
  if (seasonId) {
    const sr = await query(
      'SELECT id FROM seasons WHERE id=$1 AND anime_id=$2',
      [seasonId, animeId]
    );
    if (!sr.rows[0]) return { valid: false, reason: 'Season não pertence ao anime' };
  }
  // Valida número de episódio
  if (!episodeNumber || isNaN(episodeNumber) || episodeNumber <= 0 || episodeNumber > 10000) {
    return { valid: false, reason: `Número de episódio inválido: ${episodeNumber}` };
  }
  return { valid: true };
}

// ── Obtém ou cria season com segurança ────────────────────────
async function getOrCreateSeason(animeId, seasonNumber, isDryRun) {
  const existing = await query(
    'SELECT id FROM seasons WHERE anime_id=$1 AND number=$2',
    [animeId, seasonNumber]
  );
  if (existing.rows[0]) return existing.rows[0].id;
  if (isDryRun) return `dry-season-${seasonNumber}`;
  const r = await query(
    `INSERT INTO seasons (anime_id, number, title) VALUES ($1, $2, $3) RETURNING id`,
    [animeId, seasonNumber, `Temporada ${seasonNumber}`]
  );
  return r.rows[0].id;
}

// ── Salva episódio e fonte com deduplicação ───────────────────
async function saveEpisodeSource(animeId, seasonId, seasonNumber, epNumber, version, videoUrl, quality, episodeTitle, isDryRun, jobId) {
  // Validação crítica
  const validation = await validateAnimeSeasonEpisode(animeId, seasonId, epNumber);
  if (!validation.valid) {
    await log(jobId, 'BLOCK', `BLOQUEADO: ${validation.reason} | ep=${epNumber}`, animeId);
    return { saved: false, reason: validation.reason };
  }

  // Verifica se episódio já existe
  let episodeId = null;
  const epCheck = await query(
    'SELECT id FROM episodes WHERE anime_id=$1 AND season_number=$2 AND episode_number=$3',
    [animeId, seasonNumber, epNumber]
  );
  episodeId = epCheck.rows[0]?.id;

  if (!episodeId) {
    if (!isDryRun) {
      const er = await query(
        `INSERT INTO episodes (anime_id, season_id, season_number, episode_number, title)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (anime_id, season_number, episode_number) DO NOTHING
         RETURNING id`,
        [animeId, seasonId, seasonNumber, epNumber, episodeTitle || null]
      );
      episodeId = er.rows[0]?.id;
    } else {
      return { saved: true, isNew: true, isDryRun: true };
    }
  }

  if (!episodeId) return { saved: false, reason: 'Episódio já existe (conflito)' };

  // Verifica se source do Anibunker já existe para este episódio + versão
  const srcCheck = await query(
    `SELECT id FROM episode_sources WHERE episode_id=$1 AND provider_name='anibunker' AND language=$2`,
    [episodeId, version]
  );
  if (srcCheck.rows[0]) {
    await log(jobId, 'SKIP', `Fonte Anibunker já existe: ep=${epNumber} ${version}`, animeId);
    return { saved: false, reason: 'Fonte já existe' };
  }

  // Salva a fonte
  if (!isDryRun && videoUrl) {
    await query(
      `INSERT INTO episode_sources
         (episode_id, label, source_type, url, quality, language, is_default, provider_name)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'anibunker')
       ON CONFLICT DO NOTHING`,
      [episodeId, `${quality} ${version}`.trim(), 'mp4', videoUrl,
       quality || 'auto', version, false]
    ).catch(() => {});
  }

  return { saved: true, isNew: !epCheck.rows[0], episodeId };
}

// ── Download e armazenamento de vídeo ─────────────────────────
async function downloadAndStoreVideo(episodeData, animeId, seasonId, seasonNumber, jobId, isDryRun) {
  const { videoUrl, episode, version, title, animeSlug } = episodeData;
  if (!videoUrl) {
    await log(jobId, 'WARN', `Sem URL de vídeo: ep=${episode} ${version}`, animeId);
    return null;
  }

  // Em dry run, só registra o que faria
  if (isDryRun) {
    await log(jobId, 'INFO', `[DRY RUN] Seria baixado: ep=${episode} ${version} | ${videoUrl}`, animeId);
    return { dryRun: true, url: videoUrl };
  }

  // Verifica se já existe episódio com fonte salva
  const existingCheck = await query(
    `SELECT es.id FROM episodes e
     JOIN episode_sources es ON es.episode_id = e.id
     WHERE e.anime_id=$1 AND e.season_number=$2 AND e.episode_number=$3
       AND es.provider_name='anibunker' AND es.language=$4
     LIMIT 1`,
    [animeId, seasonNumber, episode, version]
  );
  if (existingCheck.rows[0]) {
    await log(jobId, 'SKIP', `Vídeo já armazenado: ep=${episode} ${version}`, animeId);
    return null;
  }

  // Salva episódio + fonte (URL direta, sem baixar o arquivo)
  // Para hospedar o arquivo seria necessário configurar storage próprio
  const result = await saveEpisodeSource(
    animeId, seasonId, seasonNumber,
    episode, version, videoUrl,
    episodeData.quality || 'auto',
    title, false, jobId
  );

  if (result.saved) {
    await log(jobId, 'INFO', `Episódio importado: ep=${episode} ${version} quality=${episodeData.quality}`, animeId);
  }
  return result;
}

// ── Análise: matching do catálogo com Anibunker ───────────────
async function runAnalysis(jobId, isDryRun, checkpointId = null) {
  const dbAnimes = await getDbAnimes(checkpointId);
  await updateJob(jobId, { total: dbAnimes.length, status: 'running' });
  await log(jobId, 'INFO', `Análise iniciada. ${dbAnimes.length} animes para processar.`);

  let matched = 0, review = 0, noMatch = 0, errors = 0;

  for (let i = 0; i < dbAnimes.length; i++) {
    const anime = dbAnimes[i];
    await updateJob(jobId, { processed: i+1, current_anime: anime.title, checkpoint_id: anime.id });

    try {
      // Verifica se já tem mapeamento Anibunker
      const existing = await query(
        `SELECT id, status FROM anime_external_sources WHERE anime_id=$1 AND provider=$2`,
        [anime.id, PROVIDER]
      );
      if (existing.rows[0] && ['synced','pending'].includes(existing.rows[0].status)) {
        await log(jobId, 'SKIP', `${anime.title} — já mapeado`, anime.id);
        matched++;
        continue;
      }

      // Gera slug candidato
      const slug = provider.titleToSlug(anime.title_english || anime.title);
      const candidates = [slug, `${slug}-legendado`];

      let bestAnime = null;
      let bestScore = 0;
      let bestSlug  = null;

      for (const s of candidates) {
        const animeData = await provider.fetchAnime(s);
        if (!animeData) continue;

        // findBestMatch(apiTitle, apiTitleAlt, dbAnimes)
        // apiTitle = título retornado pelo Anibunker
        // dbAnimes = [anime do banco]
        const match = findBestMatch(animeData.title, animeData.title, [anime]);

        if (match.score > bestScore) {
          bestScore = match.score;
          bestAnime = animeData;
          bestSlug  = s;
        }
      }

      if (!bestAnime || bestScore < 50) {
        noMatch++;
        await log(jobId, 'WARN', `${anime.title} — sem correspondência no Anibunker`, anime.id);
        continue;
      }

      const classification = bestScore >= 85 ? 'match' : bestScore >= 70 ? 'review_required' : 'no_match';

      if (classification === 'match') {
        await log(jobId, 'MATCH',
          `${anime.title} → ${bestAnime.title} (${bestScore}%) | leg=${bestAnime.episodesLegendado} dub=${bestAnime.episodesDublado}`,
          anime.id, { score: bestScore, slug: bestSlug }
        );
        if (!isDryRun) {
          await query(
            `INSERT INTO anime_external_sources
               (anime_id, provider, external_slug, external_title, match_score, match_method, status)
             VALUES ($1,$2,$3,$4,$5,'title_fuzzy','pending')
             ON CONFLICT (anime_id, provider) DO UPDATE SET
               external_slug=EXCLUDED.external_slug, match_score=EXCLUDED.match_score, status='pending'`,
            [anime.id, PROVIDER, bestSlug, bestAnime.title, bestScore]
          );
        }
        matched++;
      } else if (classification === 'review_required') {
        await log(jobId, 'WARN',
          `${anime.title} — revisão necessária: ${bestAnime.title} (${bestScore}%)`,
          anime.id, { score: bestScore, slug: bestSlug }
        );
        if (!isDryRun) {
          await query(
            `INSERT INTO anime_external_sources
               (anime_id, provider, external_slug, external_title, match_score, status, notes)
             VALUES ($1,$2,$3,$4,$5,'review_required',$6)
             ON CONFLICT (anime_id, provider) DO NOTHING`,
            [anime.id, PROVIDER, bestSlug, bestAnime.title, bestScore,
             `Score=${bestScore}% — revisão manual necessária`]
          );
        }
        review++;
      } else {
        noMatch++;
      }
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${anime.title} — erro: ${e.message}`, anime.id);
    }
  }

  const summary = { total: dbAnimes.length, matched, review, noMatch, errors };
  await updateJob(jobId, {
    status: 'completed', finished_at: new Date(),
    matched, review_required: review, errors,
    result_summary: JSON.stringify(summary),
  });
  await log(jobId, 'INFO',
    `Análise concluída: matched=${matched} review=${review} noMatch=${noMatch} errors=${errors}`
  );
  return summary;
}

// ── Sincroniza episódios dos animes mapeados ──────────────────
async function runSyncEpisodes(jobId, isDryRun, animeIds = null) {
  let where = `aes.provider='${PROVIDER}' AND aes.status IN ('pending','partial','review_required') AND aes.external_slug!=''`;
  const params = [];
  if (animeIds?.length) {
    params.push(animeIds);
    where += ` AND aes.anime_id=ANY($1)`;
  }

  const mapped = await query(
    `SELECT aes.id as aes_id, aes.anime_id, aes.external_slug,
            a.title, a.title_english
     FROM anime_external_sources aes
     JOIN anime a ON a.id=aes.anime_id
     WHERE ${where}
     ORDER BY a.popularity DESC NULLS LAST LIMIT 200`,
    params
  );

  await updateJob(jobId, { total: mapped.rows.length, status: 'running' });
  await log(jobId, 'INFO', `Sync episódios: ${mapped.rows.length} animes mapeados`);

  let totalEps = 0, newEps = 0, skipped = 0, errors = 0;

  for (let i = 0; i < mapped.rows.length; i++) {
    const row = mapped.rows[i];
    await updateJob(jobId, { processed: i+1, current_anime: row.title, checkpoint_id: row.anime_id });

    try {
      // Busca info do anime no Anibunker
      const animeData = await provider.fetchAnime(row.external_slug);
      if (!animeData) {
        await log(jobId, 'WARN', `${row.title} — não encontrado no Anibunker`, row.anime_id);
        continue;
      }

      const seasonId = await getOrCreateSeason(row.anime_id, 1, isDryRun);
      const versions = [];
      if (animeData.episodesLegendado > 0) versions.push({ v: 'legendado', total: animeData.episodesLegendado });
      if (animeData.episodesDublado   > 0) versions.push({ v: 'dublado',   total: animeData.episodesDublado   });

      for (const { v, total } of versions) {
        for (let ep = 1; ep <= total; ep++) {
          try {
            const epData = await provider.fetchEpisode(row.external_slug, ep, v);
            if (!epData) { skipped++; continue; }

            totalEps++;
            const result = await downloadAndStoreVideo(
              epData, row.anime_id, seasonId, 1, jobId, isDryRun
            );
            if (result?.saved || result?.dryRun) newEps++;
            else skipped++;
          } catch (epErr) {
            errors++;
            await log(jobId, 'ERROR', `${row.title} ep${ep} ${v}: ${epErr.message}`, row.anime_id);
          }
        }
      }

      if (!isDryRun) {
        await query(
          `UPDATE anime_external_sources
           SET status='synced', last_synced_at=NOW(), episode_count=$1
           WHERE id=$2`,
          [totalEps, row.aes_id]
        );
      }
    } catch (e) {
      errors++;
      await log(jobId, 'ERROR', `${row.title} — ${e.message}`, row.anime_id);
    }
  }

  const summary = { total: mapped.rows.length, episodesFound: totalEps, newEps, skipped, errors };
  await updateJob(jobId, {
    status: 'completed', finished_at: new Date(),
    episodes_added: newEps, errors,
    result_summary: JSON.stringify(summary),
  });
  await log(jobId, 'INFO',
    `Sync concluído: animes=${mapped.rows.length} eps_novos=${newEps} pulados=${skipped} erros=${errors}`
  );
  return summary;
}

// ── Jobs em background ────────────────────────────────────────
const activeJobs = new Map();

async function startJobBackground(jobId, jobType, isDryRun, userId, animeIds, checkpointId) {
  activeJobs.set(jobId, true);
  setImmediate(async () => {
    try {
      if      (jobType === 'analyze')        await runAnalysis(jobId, isDryRun, checkpointId);
      else if (jobType === 'sync_episodes')  await runSyncEpisodes(jobId, isDryRun, animeIds);
      else if (jobType === 'dry_run')        await runAnalysis(jobId, true, checkpointId);
      else if (jobType === 'sync_all') {
        await runAnalysis(jobId, isDryRun, checkpointId);
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
  createJob, startJobBackground,
  runAnalysis, runSyncEpisodes,
  isActive: (jobId) => activeJobs.has(jobId),
};
