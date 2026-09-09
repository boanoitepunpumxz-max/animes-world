const { query } = require('../utils/db');

// Campos padrão retornados nos cards (inclui external_id para proxy de imagens)
const CARD_FIELDS = `
  a.id, a.slug, a.title, a.title_english, a.cover_url, a.banner_url,
  a.external_id, a.year, a.season, a.status, a.type,
  a.episodes_count, a.score, a.popularity, a.studio
`;

const GENRES_AGG = `
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', g.id, 'name', g.name, 'slug', g.slug))
    FILTER (WHERE g.id IS NOT NULL), '[]'
  ) AS genres
`;

// ─── GET /api/anime ───────────────────────────────────────────
async function getAnimes(req, res, next) {
  try {
    const {
      page = 1, limit = 24, genre, year, season, status,
      type, sort = 'popularity', order = 'desc',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = ['a.is_hidden = false'];

    if (genre) {
      params.push(genre);
      conditions.push(`EXISTS (
        SELECT 1 FROM anime_genres ag2
        JOIN genres g2 ON g2.id = ag2.genre_id
        WHERE ag2.anime_id = a.id AND g2.slug = $${params.length}
      )`);
    }
    if (year)   { params.push(parseInt(year));         conditions.push(`a.year = $${params.length}`);   }
    if (season) { params.push(season.toUpperCase());   conditions.push(`a.season = $${params.length}`); }
    if (status) { params.push(status);                 conditions.push(`a.status = $${params.length}`); }
    if (type)   { params.push(type);                   conditions.push(`a.type = $${params.length}`);   }

    const sortMap = {
      popularity: 'a.popularity', score: 'a.score', year: 'a.year',
      title: 'a.title', episodes: 'a.episodes_count', updated: 'a.updated_at',
    };
    const sortCol = sortMap[sort] || 'a.popularity';
    const sortDir = order === 'asc' ? 'ASC' : 'DESC';
    const where   = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await query(`SELECT COUNT(*) FROM anime a ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit));
    params.push(offset);

    const result = await query(
      `SELECT ${CARD_FIELDS}, ${GENRES_AGG}
       FROM anime a
       LEFT JOIN anime_genres ag ON ag.anime_id = a.id
       LEFT JOIN genres g ON g.id = ag.genre_id
       ${where}
       GROUP BY a.id
       ORDER BY ${sortCol} ${sortDir} NULLS LAST
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      data: result.rows,
      pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) { next(err); }
}

// ─── GET /api/anime/:slug ─────────────────────────────────────
async function getAnimeBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT a.*, ${GENRES_AGG}
       FROM anime a
       LEFT JOIN anime_genres ag ON ag.anime_id = a.id
       LEFT JOIN genres g ON g.id = ag.genre_id
       WHERE a.slug = $1 AND a.is_hidden = false
       GROUP BY a.id`,
      [slug]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Anime não encontrado.' });
    }

    const anime = result.rows[0];

    const seasons = await query(
      `SELECT id, number, title, description, cover_url, year, episodes_count
       FROM seasons WHERE anime_id = $1 ORDER BY number ASC`,
      [anime.id]
    );
    anime.seasons = seasons.rows;

    await query('UPDATE anime SET popularity = popularity + 1 WHERE id = $1', [anime.id]);

    res.json({ data: anime });
  } catch (err) { next(err); }
}

// ─── GET /api/anime/featured ──────────────────────────────────
async function getFeatured(req, res, next) {
  try {
    const result = await query(
      `SELECT a.id, a.slug, a.title, a.title_english, a.description,
              a.cover_url, a.banner_url, a.background_url, a.trailer_url,
              a.external_id, a.year, a.status, a.type, a.episodes_count, a.score,
              ${GENRES_AGG}
       FROM anime a
       LEFT JOIN anime_genres ag ON ag.anime_id = a.id
       LEFT JOIN genres g ON g.id = ag.genre_id
       WHERE a.is_hidden = false AND a.score IS NOT NULL
       GROUP BY a.id
       ORDER BY a.popularity DESC NULLS LAST
       LIMIT 6`
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── GET /api/anime/popular ───────────────────────────────────
async function getPopular(req, res, next) {
  try {
    const { limit = 20 } = req.query;
    const result = await query(
      `SELECT ${CARD_FIELDS}, ${GENRES_AGG}
       FROM anime a
       LEFT JOIN anime_genres ag ON ag.anime_id = a.id
       LEFT JOIN genres g ON g.id = ag.genre_id
       WHERE a.is_hidden = false
       GROUP BY a.id
       ORDER BY a.popularity DESC NULLS LAST
       LIMIT $1`,
      [parseInt(limit)]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── GET /api/anime/recent-episodes ──────────────────────────
async function getRecentEpisodes(req, res, next) {
  try {
    const { limit = 12 } = req.query;
    const result = await query(
      `SELECT e.id AS episode_id, e.episode_number, e.season_number,
              e.title AS episode_title, e.thumbnail_url, e.created_at,
              a.id AS anime_id, a.slug, a.title, a.cover_url, a.external_id, a.type
       FROM episodes e
       JOIN anime a ON a.id = e.anime_id
       WHERE e.is_hidden = false AND a.is_hidden = false
       ORDER BY e.created_at DESC
       LIMIT $1`,
      [parseInt(limit)]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── GET /api/anime/season/:year/:season ──────────────────────
async function getBySeason(req, res, next) {
  try {
    const { year, season } = req.params;
    const result = await query(
      `SELECT ${CARD_FIELDS}, ${GENRES_AGG}
       FROM anime a
       LEFT JOIN anime_genres ag ON ag.anime_id = a.id
       LEFT JOIN genres g ON g.id = ag.genre_id
       WHERE a.year = $1 AND a.season = $2 AND a.is_hidden = false
       GROUP BY a.id
       ORDER BY a.popularity DESC NULLS LAST`,
      [parseInt(year), season.toUpperCase()]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

module.exports = { getAnimes, getAnimeBySlug, getFeatured, getPopular, getRecentEpisodes, getBySeason };
