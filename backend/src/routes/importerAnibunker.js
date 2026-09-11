/**
 * Rotas do Importador Anibunker
 * Integrado ao mesmo painel do Importador AnFireAPI
 * Prefixo: /api/admin/importer/anibunker
 */
const express = require('express');
const router  = express.Router();
const { query } = require('../utils/db');
const importer = require('../services/anibunker/AnibunkerImporter');
const provider = require('../services/anibunker/AnibunkerProvider');

const PROVIDER = 'anibunker';

// ── GET /debug-fetch/:slug — diagnóstico (temporário) ─────────
router.get('/debug-fetch/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const axios = require('axios');
    const BASE_URL = 'https://anibunker.com';
    const HEADERS = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    };
    const url = `${BASE_URL}/anime/${slug}`;
    let httpStatus = 0;
    let htmlSize = 0;
    let htmlPreview = '';
    let hasH1 = false;
    let h1Text = '';
    let hasTotalEps = false;
    let fetchError = null;
    try {
      const resp = await axios.get(url, { headers: HEADERS, timeout: 15000, decompress: true });
      httpStatus = resp.status;
      const html = resp.data;
      htmlSize = html.length;
      htmlPreview = html.substring(0, 500);
      const cheerio = require('cheerio');
      const $ = cheerio.load(html);
      hasH1 = $('h1').length > 0;
      h1Text = $('h1').first().text().trim();
      hasTotalEps = html.includes('Total Episódios') || html.includes('legendado');
    } catch(e) {
      fetchError = `HTTP ${e.response?.status || e.message}`;
    }
    const animeData = await provider.fetchAnime(slug);
    res.json({
      slug, url, httpStatus, htmlSize, htmlPreview,
      hasH1, h1Text, hasTotalEps, fetchError,
      parsedResult: animeData,
      baseUrl: BASE_URL,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /stats ────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [total, mapped, pending, synced, review, errors, eps, anixoEps] = await Promise.all([
      query('SELECT COUNT(*) FROM anime WHERE is_hidden=false'),
      query(`SELECT COUNT(*) FROM anime_external_sources WHERE provider='${PROVIDER}'`),
      query(`SELECT COUNT(*) FROM anime_external_sources WHERE provider='${PROVIDER}' AND status='pending'`),
      query(`SELECT COUNT(*) FROM anime_external_sources WHERE provider='${PROVIDER}' AND status='synced'`),
      query(`SELECT COUNT(*) FROM anime_external_sources WHERE provider='${PROVIDER}' AND status='review_required'`),
      query(`SELECT COUNT(*) FROM anime_external_sources WHERE provider='${PROVIDER}' AND status='error'`),
      query(`SELECT COUNT(*) FROM episode_sources WHERE provider_name='${PROVIDER}'`),
      query(`SELECT COUNT(*) FROM episode_sources WHERE provider_name='anixo'`),
    ]);

    const jobs = await query(
      `SELECT id, job_type, provider, status, is_dry_run, total, processed,
              matched, episodes_added, errors, review_required,
              current_anime, started_at, finished_at
       FROM import_jobs WHERE provider='${PROVIDER}' ORDER BY started_at DESC LIMIT 5`
    );

    res.json({
      provider: PROVIDER,
      enabled: provider.isEnabled,
      catalog: {
        total:    parseInt(total.rows[0].count),
        mapped:   parseInt(mapped.rows[0].count),
        pending:  parseInt(pending.rows[0].count),
        synced:   parseInt(synced.rows[0].count),
        review:   parseInt(review.rows[0].count),
        errors:   parseInt(errors.rows[0].count),
        unmapped: parseInt(total.rows[0].count) - parseInt(mapped.rows[0].count),
        // Conta fontes do anibunker + anixo (ambos são o provider do nosso importer)
        episodesImported: parseInt(eps.rows[0].count) + parseInt(anixoEps.rows[0].count),
      },
      recentJobs: jobs.rows,
    });
  } catch (err) { next(err); }
});

// ── POST /jobs — inicia job ───────────────────────────────────
router.post('/jobs', async (req, res, next) => {
  try {
    if (!provider.isEnabled) {
      return res.status(503).json({ error: 'Anibunker está desabilitado. Configure ANIBUNKER_ENABLED=true no .env' });
    }

    const { job_type = 'analyze', dry_run = false, anime_ids, checkpoint_id } = req.body;
    const validTypes = ['analyze', 'dry_run', 'sync_episodes', 'sync_all'];
    if (!validTypes.includes(job_type)) {
      return res.status(400).json({ error: `job_type inválido. Use: ${validTypes.join(', ')}` });
    }

    // Verifica se já existe job rodando do Anibunker
    const running = await query(
      `SELECT id FROM import_jobs WHERE provider='${PROVIDER}' AND status IN ('running','pending') LIMIT 1`
    );
    if (running.rows[0]) {
      return res.status(409).json({ error: 'Já existe um job Anibunker em execução.', jobId: running.rows[0].id });
    }

    const isDryRun = dry_run === true || dry_run === 'true';
    const jobId = await importer.createJob(job_type, isDryRun, req.user.id);
    await importer.startJobBackground(jobId, job_type, isDryRun, req.user.id, anime_ids, checkpoint_id);

    res.status(202).json({
      message: isDryRun
        ? `[ANIBUNKER] DRY RUN "${job_type}" iniciado. Nenhuma alteração será feita.`
        : `[ANIBUNKER] Job "${job_type}" iniciado em segundo plano.`,
      jobId,
    });
  } catch (err) { next(err); }
});

// ── GET /jobs — lista jobs ────────────────────────────────────
router.get('/jobs', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const r = await query(
      `SELECT id, job_type, status, is_dry_run, total, processed, matched,
              episodes_added, covers_added, errors, review_required,
              current_anime, started_at, finished_at, result_summary
       FROM import_jobs WHERE provider='${PROVIDER}'
       ORDER BY started_at DESC LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );
    const cnt = await query(`SELECT COUNT(*) FROM import_jobs WHERE provider='${PROVIDER}'`);
    res.json({ data: r.rows, total: parseInt(cnt.rows[0].count) });
  } catch (err) { next(err); }
});

// ── GET /jobs/:id — detalhe do job ────────────────────────────
router.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await query(`SELECT * FROM import_jobs WHERE id=$1 AND provider='${PROVIDER}'`, [req.params.id]);
    if (!job.rows[0]) return res.status(404).json({ error: 'Job não encontrado.' });
    const logs = await query(
      `SELECT level, message, details, created_at FROM import_logs
       WHERE job_id=$1 ORDER BY created_at DESC LIMIT 300`,
      [req.params.id]
    );
    res.json({ job: job.rows[0], logs: logs.rows });
  } catch (err) { next(err); }
});

// ── PATCH /jobs/:id/cancel ────────────────────────────────────
router.patch('/jobs/:id/cancel', async (req, res, next) => {
  try {
    await query(
      `UPDATE import_jobs SET status='cancelled', finished_at=NOW() WHERE id=$1 AND provider='${PROVIDER}'`,
      [req.params.id]
    );
    res.json({ message: 'Job cancelado.' });
  } catch (err) { next(err); }
});

// ── GET /mappings — lista mapeamentos ─────────────────────────
router.get('/mappings', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 30, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [PROVIDER];
    const conds  = ['aes.provider=$1'];
    if (status) { params.push(status); conds.push(`aes.status=$${params.length}`); }
    if (q)      { params.push(`%${q}%`); conds.push(`(a.title ILIKE $${params.length} OR a.title_english ILIKE $${params.length})`); }
    const where = conds.join(' AND ');
    const cnt   = await query(`SELECT COUNT(*) FROM anime_external_sources aes JOIN anime a ON a.id=aes.anime_id WHERE ${where}`, params);
    params.push(parseInt(limit)); params.push(offset);
    const r = await query(
      `SELECT aes.id, aes.anime_id, aes.external_slug, aes.external_title,
              aes.match_score, aes.match_method, aes.status, aes.last_synced_at,
              aes.episode_count, aes.notes,
              a.title, a.title_english, a.cover_url, a.episodes_count
       FROM anime_external_sources aes JOIN anime a ON a.id=aes.anime_id
       WHERE ${where} ORDER BY a.popularity DESC NULLS LAST
       LIMIT $${params.length-1} OFFSET $${params.length}`,
      params
    );
    res.json({ data: r.rows, total: parseInt(cnt.rows[0].count), page: parseInt(page) });
  } catch (err) { next(err); }
});

// ── PATCH /mappings/:id — atualiza mapeamento ─────────────────
router.patch('/mappings/:id', async (req, res, next) => {
  try {
    const { status, external_slug, notes } = req.body;
    await query(
      `UPDATE anime_external_sources
       SET status=COALESCE($1,status), external_slug=COALESCE($2,external_slug),
           notes=COALESCE($3,notes), updated_at=NOW()
       WHERE id=$4 AND provider='${PROVIDER}'`,
      [status, external_slug, notes, req.params.id]
    );
    res.json({ message: 'Mapeamento atualizado.' });
  } catch (err) { next(err); }
});

// ── DELETE /mappings/:id ──────────────────────────────────────
router.delete('/mappings/:id', async (req, res, next) => {
  try {
    await query(`DELETE FROM anime_external_sources WHERE id=$1 AND provider='${PROVIDER}'`, [req.params.id]);
    res.json({ message: 'Mapeamento removido.' });
  } catch (err) { next(err); }
});

// ── POST /rollback/:jobId ─────────────────────────────────────
router.post('/rollback/:jobId', async (req, res, next) => {
  try {
    const job = await query(`SELECT * FROM import_jobs WHERE id=$1 AND provider='${PROVIDER}'`, [req.params.jobId]);
    if (!job.rows[0]) return res.status(404).json({ error: 'Job não encontrado.' });
    if (job.rows[0].status === 'running') {
      return res.status(409).json({ error: 'Não é possível fazer rollback de job em execução.' });
    }
    const animes = await query(
      `SELECT DISTINCT anime_id FROM import_logs WHERE job_id=$1 AND anime_id IS NOT NULL`,
      [req.params.jobId]
    );
    const ids = animes.rows.map(r => r.anime_id);
    if (!ids.length) return res.json({ message: 'Nenhum dado para reverter.', removed: 0 });
    const removed = await query(
      `DELETE FROM episode_sources WHERE provider_name='${PROVIDER}'
       AND episode_id IN (SELECT e.id FROM episodes e WHERE e.anime_id=ANY($1))`,
      [ids]
    );
    await query(
      `UPDATE anime_external_sources SET status='pending', last_synced_at=NULL WHERE anime_id=ANY($1) AND provider='${PROVIDER}'`,
      [ids]
    );
    res.json({ message: 'Rollback concluído.', sourcesRemoved: removed.rowCount });
  } catch (err) { next(err); }
});

module.exports = router;
