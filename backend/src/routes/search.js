const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');

// GET /api/search?q=naruto&limit=10
router.get('/', async (req, res, next) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ data: [], suggestion: 'Digite pelo menos 2 caracteres.' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const search = q.trim();

    const result = await query(
      `SELECT a.id, a.slug, a.title, a.title_english, a.cover_url,
              a.year, a.type, a.score, a.status, a.episodes_count,
              ts_rank(to_tsvector('simple', a.title || ' ' || COALESCE(a.title_english,'')),
                      plainto_tsquery('simple', $1)) AS rank
       FROM anime a
       WHERE a.is_hidden = false
         AND (
           a.title ILIKE $2
           OR a.title_english ILIKE $2
           OR a.title_romaji ILIKE $2
           OR a.title_japanese ILIKE $2
         )
       ORDER BY rank DESC, a.popularity DESC
       LIMIT $3 OFFSET $4`,
      [search, `%${search}%`, parseInt(limit), offset]
    );

    res.json({ data: result.rows, query: search });
  } catch (err) { next(err); }
});

// GET /api/search/suggestions?q=naru  (para autocomplete)
router.get('/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ data: [] });

    const result = await query(
      `SELECT slug, title, title_english, cover_url, year, type
       FROM anime
       WHERE is_hidden = false
         AND (title ILIKE $1 OR title_english ILIKE $1)
       ORDER BY popularity DESC
       LIMIT 8`,
      [`%${q.trim()}%`]
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
});

module.exports = router;
