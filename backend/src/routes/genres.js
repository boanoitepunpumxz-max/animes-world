const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT g.id, g.name, g.slug, g.icon,
              COUNT(ag.anime_id) AS anime_count
       FROM genres g
       LEFT JOIN anime_genres ag ON ag.genre_id = g.id
       LEFT JOIN anime a ON a.id = ag.anime_id AND a.is_hidden = false
       GROUP BY g.id
       ORDER BY g.name ASC`
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 24 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const genreResult = await query('SELECT * FROM genres WHERE slug = $1', [slug]);
    if (!genreResult.rows[0]) return res.status(404).json({ error: 'Gênero não encontrado.' });

    const genre = genreResult.rows[0];

    const countResult = await query(
      `SELECT COUNT(*) FROM anime a
       JOIN anime_genres ag ON ag.anime_id = a.id
       WHERE ag.genre_id = $1 AND a.is_hidden = false`,
      [genre.id]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await query(
      `SELECT a.id, a.slug, a.title, a.title_english, a.cover_url,
              a.year, a.type, a.score, a.status, a.episodes_count
       FROM anime a
       JOIN anime_genres ag ON ag.anime_id = a.id
       WHERE ag.genre_id = $1 AND a.is_hidden = false
       ORDER BY a.popularity DESC
       LIMIT $2 OFFSET $3`,
      [genre.id, parseInt(limit), offset]
    );

    res.json({
      genre,
      data: result.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) { next(err); }
});

module.exports = router;
