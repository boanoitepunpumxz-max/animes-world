const express = require('express');
const router = express.Router();
const { query } = require('../utils/db');

// Registra que o usuário começou a assistir
router.post('/start', async (req, res, next) => {
  try {
    const { animeId, episodeId } = req.body;
    const userId = req.user.id;

    await query(
      `INSERT INTO watch_history (user_id, anime_id, episode_id)
       VALUES ($1, $2, $3)`,
      [userId, animeId, episodeId]
    );

    res.json({ message: 'ok' });
  } catch (err) { next(err); }
});

module.exports = router;
