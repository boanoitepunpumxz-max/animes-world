const { query } = require('../utils/db');

// ─── GET /api/episodes/:animeId/seasons/:season ───────────────
async function getEpisodesBySeason(req, res, next) {
  try {
    const { animeId, season } = req.params;
    const userId = req.user?.id;

    const result = await query(
      `SELECT e.id, e.episode_number, e.season_number, e.title,
              e.description, e.thumbnail_url, e.duration, e.air_date,
              e.is_filler,
              EXISTS (
                SELECT 1 FROM episode_sources es WHERE es.episode_id = e.id LIMIT 1
              ) AS has_sources
       FROM episodes e
       WHERE e.anime_id = $1 AND e.season_number = $2 AND e.is_hidden = false
       ORDER BY e.episode_number ASC`,
      [animeId, parseInt(season)]
    );

    let episodes = result.rows;

    // Se usuário autenticado, adicionar progresso
    if (userId && episodes.length > 0) {
      const episodeIds = episodes.map(e => e.id);
      const progressResult = await query(
        `SELECT episode_id, progress_seconds, duration_seconds, percentage, completed
         FROM watch_progress
         WHERE user_id = $1 AND episode_id = ANY($2)`,
        [userId, episodeIds]
      );
      const progressMap = {};
      progressResult.rows.forEach(p => { progressMap[p.episode_id] = p; });
      episodes = episodes.map(ep => ({
        ...ep,
        progress: progressMap[ep.id] || null,
      }));
    }

    res.json({ data: episodes });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/episodes/:animeId/all ──────────────────────────
async function getAllEpisodes(req, res, next) {
  try {
    const { animeId } = req.params;
    const result = await query(
      `SELECT id, episode_number, season_number, title, thumbnail_url, duration,
              EXISTS (
                SELECT 1 FROM episode_sources es WHERE es.episode_id = episodes.id LIMIT 1
              ) AS has_sources
       FROM episodes
       WHERE anime_id = $1 AND is_hidden = false
       ORDER BY season_number ASC, episode_number ASC`,
      [animeId]
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/episodes/:episodeId ────────────────────────────
async function getEpisode(req, res, next) {
  try {
    const { episodeId } = req.params;

    const result = await query(
      `SELECT e.*, a.title AS anime_title, a.slug AS anime_slug,
              a.cover_url AS anime_cover, a.type AS anime_type
       FROM episodes e
       JOIN anime a ON a.id = e.anime_id
       WHERE e.id = $1 AND e.is_hidden = false`,
      [episodeId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Episódio não encontrado.' });
    }

    const episode = result.rows[0];

    // Fontes de vídeo
    const sourcesResult = await query(
      `SELECT id, label, source_type, url, quality, language, is_default, provider_name
       FROM episode_sources
       WHERE episode_id = $1
       ORDER BY is_default DESC, sort_order ASC`,
      [episodeId]
    );
    episode.sources = sourcesResult.rows;

    // Episódio anterior
    const prevResult = await query(
      `SELECT id, episode_number, season_number, title
       FROM episodes
       WHERE anime_id = $1 AND is_hidden = false
         AND (season_number < $2 OR (season_number = $2 AND episode_number < $3))
       ORDER BY season_number DESC, episode_number DESC
       LIMIT 1`,
      [episode.anime_id, episode.season_number, episode.episode_number]
    );

    // Próximo episódio
    const nextResult = await query(
      `SELECT id, episode_number, season_number, title
       FROM episodes
       WHERE anime_id = $1 AND is_hidden = false
         AND (season_number > $2 OR (season_number = $2 AND episode_number > $3))
       ORDER BY season_number ASC, episode_number ASC
       LIMIT 1`,
      [episode.anime_id, episode.season_number, episode.episode_number]
    );

    episode.prev_episode = prevResult.rows[0] || null;
    episode.next_episode = nextResult.rows[0] || null;

    // Progresso do usuário se autenticado
    if (req.user) {
      const progressResult = await query(
        `SELECT progress_seconds, duration_seconds, percentage, completed
         FROM watch_progress WHERE user_id = $1 AND episode_id = $2`,
        [req.user.id, episodeId]
      );
      episode.user_progress = progressResult.rows[0] || null;
    }

    res.json({ data: episode });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/episodes/:episodeId/progress ──────────────────
async function saveProgress(req, res, next) {
  try {
    const { episodeId } = req.params;
    const { progressSeconds, durationSeconds, animeId } = req.body;
    const userId = req.user.id;

    const percentage = durationSeconds > 0
      ? Math.min(100, Math.round((progressSeconds / durationSeconds) * 100))
      : 0;
    const completed = percentage >= 85;

    await query(
      `INSERT INTO watch_progress
         (user_id, anime_id, episode_id, progress_seconds, duration_seconds, percentage, completed, last_watched_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id, episode_id) DO UPDATE SET
         progress_seconds = EXCLUDED.progress_seconds,
         duration_seconds = EXCLUDED.duration_seconds,
         percentage = EXCLUDED.percentage,
         completed = EXCLUDED.completed,
         last_watched_at = NOW()`,
      [userId, animeId, episodeId, progressSeconds, durationSeconds, percentage, completed]
    );

    // Adicionar ao histórico se completou ou é novo acesso
    if (completed || progressSeconds < 60) {
      await query(
        `INSERT INTO watch_history (user_id, anime_id, episode_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [userId, animeId, episodeId]
      ).catch(() => {});
    }

    res.json({ percentage, completed });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEpisodesBySeason, getAllEpisodes, getEpisode, saveProgress };
