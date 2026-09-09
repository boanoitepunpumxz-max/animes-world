const bcrypt = require('bcryptjs');
const { query } = require('../utils/db');

// ─── GET /api/user/profile ────────────────────────────────────
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT u.id, u.username, u.email, u.avatar_url, u.bio, u.created_at, u.last_login_at,
              (SELECT COUNT(*) FROM favorites WHERE user_id = u.id) AS favorites_count,
              (SELECT COUNT(DISTINCT anime_id) FROM watch_progress WHERE user_id = u.id) AS animes_watched,
              (SELECT COUNT(*) FROM watch_history WHERE user_id = u.id) AS episodes_watched,
              (SELECT COALESCE(SUM(e.duration), 0) FROM watch_history wh
               JOIN episodes e ON e.id = wh.episode_id WHERE wh.user_id = u.id) AS minutes_watched
       FROM users u WHERE u.id = $1`,
      [userId]
    );
    res.json({ data: result.rows[0] });
  } catch (err) { next(err); }
}

// ─── PATCH /api/user/profile ──────────────────────────────────
async function updateProfile(req, res, next) {
  try {
    const { username, bio, avatarUrl, birthDate } = req.body;
    const userId = req.user.id;

    if (username && username !== req.user.username) {
      const exists = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );
      if (exists.rows.length > 0) {
        return res.status(409).json({ error: 'Username já está em uso.' });
      }
    }

    const result = await query(
      `UPDATE users
       SET username = COALESCE($1, username),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           birth_date = COALESCE($4, birth_date),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, username, email, avatar_url, bio`,
      [username, bio, avatarUrl, birthDate, userId]
    );

    res.json({ message: 'Perfil atualizado.', data: result.rows[0] });
  } catch (err) { next(err); }
}

// ─── PATCH /api/user/password ─────────────────────────────────
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);

    if (!valid) {
      return res.status(400).json({ error: 'Senha atual incorreta.' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);

    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (err) { next(err); }
}

// ─── GET /api/user/history ────────────────────────────────────
async function getHistory(req, res, next) {
  try {
    const { page = 1, limit = 24 } = req.query;
    const userId = req.user.id;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const result = await query(
      `SELECT DISTINCT ON (wh.anime_id, wh.episode_id)
              wh.id, wh.watched_at,
              a.id AS anime_id, a.slug, a.title, a.cover_url, a.type,
              e.id AS episode_id, e.episode_number, e.season_number, e.title AS episode_title,
              wp.percentage, wp.completed
       FROM watch_history wh
       JOIN anime a ON a.id = wh.anime_id
       JOIN episodes e ON e.id = wh.episode_id
       LEFT JOIN watch_progress wp ON wp.user_id = wh.user_id AND wp.episode_id = wh.episode_id
       WHERE wh.user_id = $1
       ORDER BY wh.anime_id, wh.episode_id, wh.watched_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), offset]
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── DELETE /api/user/history ─────────────────────────────────
async function clearHistory(req, res, next) {
  try {
    await query('DELETE FROM watch_history WHERE user_id = $1', [req.user.id]);
    await query('DELETE FROM watch_progress WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Histórico limpo.' });
  } catch (err) { next(err); }
}

// ─── GET /api/user/continue-watching ─────────────────────────
async function getContinueWatching(req, res, next) {
  try {
    const { limit = 10 } = req.query;
    const result = await query(
      `SELECT DISTINCT ON (wp.anime_id)
              wp.anime_id, wp.episode_id, wp.percentage, wp.progress_seconds,
              wp.duration_seconds, wp.last_watched_at,
              a.slug, a.title, a.cover_url, a.type,
              e.episode_number, e.season_number, e.title AS episode_title
       FROM watch_progress wp
       JOIN anime a ON a.id = wp.anime_id
       JOIN episodes e ON e.id = wp.episode_id
       WHERE wp.user_id = $1 AND wp.completed = false AND wp.percentage > 1
       ORDER BY wp.anime_id, wp.last_watched_at DESC
       LIMIT $2`,
      [req.user.id, parseInt(limit)]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── GET /api/user/favorites ──────────────────────────────────
async function getFavorites(req, res, next) {
  try {
    const result = await query(
      `SELECT a.id, a.slug, a.title, a.cover_url, a.year, a.type, a.score, a.status,
              f.created_at AS favorited_at
       FROM favorites f
       JOIN anime a ON a.id = f.anime_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── POST /api/user/favorites/:animeId ───────────────────────
async function toggleFavorite(req, res, next) {
  try {
    const { animeId } = req.params;
    const userId = req.user.id;

    const exists = await query(
      'SELECT 1 FROM favorites WHERE user_id = $1 AND anime_id = $2',
      [userId, animeId]
    );

    if (exists.rows.length > 0) {
      await query('DELETE FROM favorites WHERE user_id = $1 AND anime_id = $2', [userId, animeId]);
      res.json({ favorited: false, message: 'Removido dos favoritos.' });
    } else {
      await query('INSERT INTO favorites (user_id, anime_id) VALUES ($1, $2)', [userId, animeId]);
      res.json({ favorited: true, message: 'Adicionado aos favoritos.' });
    }
  } catch (err) { next(err); }
}

// ─── GET /api/user/watchlist ──────────────────────────────────
async function getWatchlist(req, res, next) {
  try {
    const { status } = req.query;
    let q = `
      SELECT a.id, a.slug, a.title, a.cover_url, a.year, a.type, a.score, a.status AS anime_status,
             w.status, w.created_at, w.updated_at
      FROM watchlist w
      JOIN anime a ON a.id = w.anime_id
      WHERE w.user_id = $1
    `;
    const params = [req.user.id];
    if (status) { params.push(status); q += ` AND w.status = $2`; }
    q += ' ORDER BY w.updated_at DESC';

    const result = await query(q, params);
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── POST /api/user/watchlist/:animeId ───────────────────────
async function updateWatchlist(req, res, next) {
  try {
    const { animeId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const valid = ['watching', 'want_to_watch', 'completed', 'paused', 'dropped'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    await query(
      `INSERT INTO watchlist (user_id, anime_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, anime_id) DO UPDATE SET status = $3, updated_at = NOW()`,
      [userId, animeId, status]
    );

    res.json({ message: 'Lista atualizada.', status });
  } catch (err) { next(err); }
}

// ─── DELETE /api/user/watchlist/:animeId ─────────────────────
async function removeFromWatchlist(req, res, next) {
  try {
    await query(
      'DELETE FROM watchlist WHERE user_id = $1 AND anime_id = $2',
      [req.user.id, req.params.animeId]
    );
    res.json({ message: 'Removido da lista.' });
  } catch (err) { next(err); }
}

// ─── GET/PUT /api/user/settings ──────────────────────────────
async function getSettings(req, res, next) {
  try {
    const result = await query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ data: result.rows[0] || {} });
  } catch (err) { next(err); }
}

async function updateSettings(req, res, next) {
  try {
    const {
      autoplay, continueWatching, defaultQuality, defaultLanguage,
      subtitlesEnabled, theme, animations, emailNotifications,
      profilePublic, historyPublic,
    } = req.body;

    await query(
      `INSERT INTO user_settings (user_id, autoplay, continue_watching, default_quality, default_language,
         subtitles_enabled, theme, animations, email_notifications, profile_public, history_public)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (user_id) DO UPDATE SET
         autoplay = COALESCE($2, user_settings.autoplay),
         continue_watching = COALESCE($3, user_settings.continue_watching),
         default_quality = COALESCE($4, user_settings.default_quality),
         default_language = COALESCE($5, user_settings.default_language),
         subtitles_enabled = COALESCE($6, user_settings.subtitles_enabled),
         theme = COALESCE($7, user_settings.theme),
         animations = COALESCE($8, user_settings.animations),
         email_notifications = COALESCE($9, user_settings.email_notifications),
         profile_public = COALESCE($10, user_settings.profile_public),
         history_public = COALESCE($11, user_settings.history_public),
         updated_at = NOW()`,
      [req.user.id, autoplay, continueWatching, defaultQuality, defaultLanguage,
       subtitlesEnabled, theme, animations, emailNotifications, profilePublic, historyPublic]
    );

    res.json({ message: 'Configurações salvas.' });
  } catch (err) { next(err); }
}

module.exports = {
  getProfile, updateProfile, changePassword,
  getHistory, clearHistory, getContinueWatching,
  getFavorites, toggleFavorite,
  getWatchlist, updateWatchlist, removeFromWatchlist,
  getSettings, updateSettings,
};
