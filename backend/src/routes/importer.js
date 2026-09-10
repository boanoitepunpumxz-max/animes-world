/**
 * Rotas do Importador AnFireAPI
 * Todas requerem autenticação admin (aplicado no admin.js)
 */
const express = require('express');
const router  = express.Router();
const { query } = require('../utils/db');
const {
  createJob, startJobBackground, pauseJob, cancelJob,
} = require('../services/anfire/AnimeImporter');
const { findBestMatch, prefilterCandidates } = require('../services/anfire/AnimeMatcher');
const { searchAnime } = require('../services/anfire/AnFireProvider');

// ── GET /api/admin/importer/stats ─────────────────────────────
// Resumo geral do importador
router.get('/stats', async (req, res, next) => {
  try {
    const [total, mapped, pending, synced, review, errors, recentJobs] = await Promise.all([
      query('SELECT COUNT(*) FROM anime WHERE is_hidden=false'),
      query("SELECT COUNT(*) FROM anime_external_sources WHERE provider='anfire'"),
      query("SELECT COUNT(*) FROM anime_external_sources WHERE provider='anfire' AND status='pending'"),
      query("SELECT COUNT(*) FROM anime_external_sources WHERE provider='anfire' AND status='synced'"),
      query("SELECT COUNT(*) FROM anime_external_sources WHERE provider='anfire' AND status='review_required'"),
      query("SELECT COUNT(*) FROM anime_external_sources WHERE provider='anfire' AND status='error'"),
      query(`SELECT id, job_type, status, is_dry_run, total, processed, matched, episodes_added,
                    covers_added, errors, review_required, current_anime, started_at, finished_at
             FROM import_jobs ORDER BY started_at DESC LIMIT 5`),
    ]);

    const episodesAdded = await query(
      `SELECT COUNT(*) FROM episodes e
       JOIN anime_external_sources aes ON aes.anime_id = e.anime_id
       WHERE aes.provider = 'anfire'`
    );

    res.json({
      catalog: {
        total:    parseInt(total.rows[0].count),
        mapped:   parseInt(mapped.rows[0].count),
        pending:  parseInt(pending.rows[0].count),
        synced:   parseInt(synced.rows[0].count),
        review:   parseInt(review.rows[0].count),
        errors:   parseInt(errors.rows[0].count),
        unmapped: parseInt(total.rows[0].count) - parseInt(mapped.rows[0].count),
        episodesAdded: parseInt(episodesAdded.rows[0].count),
      },
      recentJobs: recentJobs.rows,
    });
  } catch (err) { next(err); }
});

// ── GET /api/admin/importer/jobs ──────────────────────────────
router.get('/jobs', async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const r = await query(
      `SELECT id, job_type, status, is_dry_run, total, processed, matched,
              episodes_added, covers_added, errors, review_required,
              current_anime, started_at, finished_at, result_summary
       FROM import_jobs
       ORDER BY started_at DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );
    const cnt = await query('SELECT COUNT(*) FROM import_jobs');
    res.json({ data: r.rows, total: parseInt(cnt.rows[0].count) });
  } catch (err) { next(err); }
});

// ── GET /api/admin/importer/jobs/:id ─────────────────────────
router.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await query('SELECT * FROM import_jobs WHERE id=$1', [req.params.id]);
    if (!job.rows[0]) return res.status(404).json({ error: 'Job não encontrado.' });
    const logs = await query(
      `SELECT level, message, details, created_at FROM import_logs
       WHERE job_id=$1 ORDER BY created_at DESC LIMIT 200`,
      [req.params.id]
    );
    res.json({ job: job.rows[0], logs: logs.rows });
  } catch (err) { next(err); }
});

// ── POST /api/admin/importer/jobs — inicia um job ─────────────
router.post('/jobs', async (req, res, next) => {
  try {
    const { job_type = 'analyze', dry_run = false, anime_ids } = req.body;
    const validTypes = ['analyze', 'dry_run', 'sync_covers', 'sync_episodes', 'sync_all'];
    if (!validTypes.includes(job_type)) {
      return res.status(400).json({ error: `job_type inválido. Use: ${validTypes.join(', ')}` });
    }

    // Verifica se já existe job rodando
    const running = await query(
      `SELECT id FROM import_jobs WHERE status IN ('running','pending') LIMIT 1`
    );
    if (running.rows[0]) {
      return res.status(409).json({
        error: 'Já existe um job em execução.',
        jobId: running.rows[0].id,
      });
    }

    const isDryRun  = dry_run === true || dry_run === 'true';
    const jobId     = await createJob(job_type, isDryRun, req.user.id);
    await startJobBackground(jobId, job_type, isDryRun, req.user.id, anime_ids);

    res.status(202).json({
      message: isDryRun
        ? 'DRY RUN iniciado. Nenhuma alteração será feita no banco.'
        : `Job "${job_type}" iniciado em segundo plano.`,
      jobId,
    });
  } catch (err) { next(err); }
});

// ── PATCH /api/admin/importer/jobs/:id/pause ─────────────────
router.patch('/jobs/:id/pause', async (req, res, next) => {
  try {
    await pauseJob(req.params.id);
    res.json({ message: 'Job pausado.' });
  } catch (err) { next(err); }
});

// ── PATCH /api/admin/importer/jobs/:id/cancel ─────────────────
router.patch('/jobs/:id/cancel', async (req, res, next) => {
  try {
    await cancelJob(req.params.id);
    res.json({ message: 'Job cancelado.' });
  } catch (err) { next(err); }
});

// ── GET /api/admin/importer/mappings ─────────────────────────
// Lista mapeamentos anime → AnFireAPI
router.get('/mappings', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 30, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conds  = [`aes.provider = 'anfire'`];

    if (status) { params.push(status); conds.push(`aes.status = $${params.length}`); }
    if (q)      { params.push(`%${q}%`); conds.push(`(a.title ILIKE $${params.length} OR a.title_english ILIKE $${params.length})`); }

    const where = conds.join(' AND ');
    const cnt   = await query(`SELECT COUNT(*) FROM anime_external_sources aes JOIN anime a ON a.id=aes.anime_id WHERE ${where}`, params);

    params.push(parseInt(limit)); params.push(offset);
    const r = await query(
      `SELECT aes.id, aes.anime_id, aes.external_slug, aes.external_title,
              aes.match_score, aes.match_method, aes.status, aes.last_synced_at,
              aes.episode_count, aes.cover_fetched, aes.notes,
              a.title, a.title_english, a.cover_url, a.episodes_count
       FROM anime_external_sources aes
       JOIN anime a ON a.id = aes.anime_id
       WHERE ${where}
       ORDER BY a.popularity DESC NULLS LAST
       LIMIT $${params.length-1} OFFSET $${params.length}`,
      params
    );
    res.json({ data: r.rows, total: parseInt(cnt.rows[0].count), page: parseInt(page) });
  } catch (err) { next(err); }
});

// ── PATCH /api/admin/importer/mappings/:id ───────────────────
// Permite confirmar/rejeitar/editar um mapeamento manualmente
router.patch('/mappings/:id', async (req, res, next) => {
  try {
    const { status, external_slug, notes } = req.body;
    const valid = ['pending','synced','partial','error','review_required'];
    if (status && !valid.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }
    await query(
      `UPDATE anime_external_sources
       SET status = COALESCE($1, status),
           external_slug = COALESCE($2, external_slug),
           notes = COALESCE($3, notes),
           updated_at = NOW()
       WHERE id = $4`,
      [status, external_slug, notes, req.params.id]
    );
    res.json({ message: 'Mapeamento atualizado.' });
  } catch (err) { next(err); }
});

// ── DELETE /api/admin/importer/mappings/:id ──────────────────
router.delete('/mappings/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM anime_external_sources WHERE id=$1', [req.params.id]);
    res.json({ message: 'Mapeamento removido.' });
  } catch (err) { next(err); }
});

// ── POST /api/admin/importer/search ──────────────────────────
// Busca manual na AnFireAPI
router.post('/search', async (req, res, next) => {
  try {
    const { query: q } = req.body;
    if (!q || q.trim().length < 2) return res.status(400).json({ error: 'Query muito curta.' });
    const results = await searchAnime(q.trim());
    res.json({ data: results });
  } catch (err) { next(err); }
});

// ── POST /api/admin/importer/match ───────────────────────────
// Calcula matching entre um anime e resultados da API
router.post('/match', async (req, res, next) => {
  try {
    const { anime_id, api_results } = req.body;
    if (!anime_id || !api_results?.length) {
      return res.status(400).json({ error: 'anime_id e api_results obrigatórios.' });
    }
    const animeR = await query(
      `SELECT id, title, title_english, title_romaji, title_japanese FROM anime WHERE id=$1`,
      [anime_id]
    );
    if (!animeR.rows[0]) return res.status(404).json({ error: 'Anime não encontrado.' });

    const anime = animeR.rows[0];
    const candidates = api_results.map(r => ({
      id: r.slug, slug: r.slug, title: r.title,
      title_english: r.title, title_romaji: r.title, title_japanese: null,
    }));

    const result = findBestMatch(anime.title_english || anime.title, anime.title, candidates);
    res.json({ anime, result });
  } catch (err) { next(err); }
});

// ── POST /api/admin/importer/rollback/:jobId ─────────────────
// Remove episódios criados por um job específico
router.post('/rollback/:jobId', async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await query('SELECT * FROM import_jobs WHERE id=$1', [jobId]);
    if (!job.rows[0]) return res.status(404).json({ error: 'Job não encontrado.' });
    if (job.rows[0].status === 'running') {
      return res.status(409).json({ error: 'Não é possível fazer rollback de job em execução.' });
    }

    // Busca log de episódios criados por este job (animes que tiveram episodes_added > 0)
    const logsR = await query(
      `SELECT DISTINCT anime_id FROM import_logs WHERE job_id=$1 AND level='INFO' AND anime_id IS NOT NULL`,
      [jobId]
    );
    const animeIds = logsR.rows.map(r => r.anime_id);

    if (!animeIds.length) return res.json({ message: 'Nenhum dado para reverter.', removed: 0 });

    // ATENÇÃO: remove apenas sources criadas pela AnFireAPI, não episódios inteiros
    // (episódios podem ter sido criados antes por outra fonte)
    const removed = await query(
      `DELETE FROM episode_sources
       WHERE provider_name = 'anfire'
         AND episode_id IN (
           SELECT e.id FROM episodes e WHERE e.anime_id = ANY($1)
         )`,
      [animeIds]
    );

    // Reseta status dos mapeamentos
    await query(
      `UPDATE anime_external_sources SET status='pending', last_synced_at=NULL WHERE anime_id=ANY($1)`,
      [animeIds]
    );

    await query(
      `UPDATE import_jobs SET status='cancelled', notes=$1 WHERE id=$2`,
      [`Rollback executado. Fontes removidas: ${removed.rowCount}`, jobId]
    );

    res.json({ message: 'Rollback concluído.', sourcesRemoved: removed.rowCount, animesAffected: animeIds.length });
  } catch (err) { next(err); }
});

module.exports = router;
