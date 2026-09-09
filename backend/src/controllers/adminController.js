const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const { query } = require('../utils/db');

// ─── Dashboard ────────────────────────────────────────────────
async function getDashboard(req, res, next) {
  try {
    const [users, animes, episodes, tickets, recentLogins] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM anime WHERE is_hidden = false'),
      query('SELECT COUNT(*) FROM episodes WHERE is_hidden = false'),
      query("SELECT COUNT(*) FROM support_tickets WHERE status = 'open'"),
      query(`
        SELECT u.username, u.email, u.avatar_url, al.ip_address, al.created_at, al.user_agent
        FROM access_logs al
        JOIN users u ON u.id = al.user_id
        WHERE al.action = 'login'
        ORDER BY al.created_at DESC LIMIT 10
      `),
    ]);

    res.json({
      stats: {
        totalUsers: parseInt(users.rows[0].count),
        totalAnimes: parseInt(animes.rows[0].count),
        totalEpisodes: parseInt(episodes.rows[0].count),
        openTickets: parseInt(tickets.rows[0].count),
      },
      recentLogins: recentLogins.rows,
    });
  } catch (err) { next(err); }
}

// ─── Usuários ─────────────────────────────────────────────────
async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, q, status, role } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(u.username ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
    }
    if (status) { params.push(status); conditions.push(`u.status = $${params.length}`); }
    if (role) { params.push(role); conditions.push(`u.role = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await query(`SELECT COUNT(*) FROM users u ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit)); params.push(offset);
    const result = await query(
      `SELECT u.id, u.username, u.email, u.role, u.status, u.avatar_url,
              u.created_at, u.last_login_at,
              (SELECT COUNT(*) FROM watch_history WHERE user_id = u.id) AS episodes_watched
       FROM users u ${where}
       ORDER BY u.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ data: result.rows, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { status, role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Você não pode alterar seu próprio status/role.' });
    }

    await query(
      `UPDATE users SET
         status = COALESCE($1, status),
         role = COALESCE($2, role),
         updated_at = NOW()
       WHERE id = $3`,
      [status, role, id]
    );

    res.json({ message: 'Usuário atualizado.' });
  } catch (err) { next(err); }
}

// ─── Logs de Segurança ────────────────────────────────────────
async function getSecurityLogs(req, res, next) {
  try {
    const { page = 1, limit = 50, userId, action, ip } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (userId) { params.push(userId); conditions.push(`al.user_id = $${params.length}`); }
    if (action) { params.push(action); conditions.push(`al.action = $${params.length}`); }
    if (ip) { params.push(ip); conditions.push(`al.ip_address::text ILIKE $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    params.push(parseInt(limit)); params.push(offset);
    const result = await query(
      `SELECT al.id, al.action, al.ip_address, al.user_agent, al.path,
              al.method, al.status_code, al.created_at, al.metadata,
              u.username, u.email
       FROM access_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ${where}
       ORDER BY al.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

async function getLoginAttempts(req, res, next) {
  try {
    const { page = 1, limit = 50, ip, email, success } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (ip) { params.push(ip); conditions.push(`ip_address::text ILIKE $${params.length}`); }
    if (email) { params.push(`%${email}%`); conditions.push(`email ILIKE $${params.length}`); }
    if (success !== undefined) { params.push(success === 'true'); conditions.push(`success = $${params.length}`); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    params.push(parseInt(limit)); params.push(offset);

    const result = await query(
      `SELECT id, email, ip_address, success, user_agent, created_at
       FROM login_attempts ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

// ─── Admin — Animes ───────────────────────────────────────────
async function adminGetAnimes(req, res, next) {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (q) {
      params.push(`%${q}%`);
      where = `WHERE a.title ILIKE $1 OR a.title_english ILIKE $1`;
    }

    const countResult = await query(`SELECT COUNT(*) FROM anime a ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit)); params.push(offset);
    const result = await query(
      `SELECT a.id, a.slug, a.title, a.cover_url, a.year, a.type, a.status,
              a.episodes_count, a.score, a.is_hidden, a.updated_at,
              (SELECT COUNT(*) FROM episodes e WHERE e.anime_id = a.id) AS ep_count_real
       FROM anime a ${where}
       ORDER BY a.updated_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ data: result.rows, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
}

async function adminUpdateAnime(req, res, next) {
  try {
    const { id } = req.params;
    const {
      title, titleEnglish, description, coverUrl, bannerUrl,
      year, status, type, episodesCount, isHidden,
    } = req.body;

    const slug = title ? slugify(title, { lower: true, strict: true }) : undefined;

    await query(
      `UPDATE anime SET
         title = COALESCE($1, title),
         title_english = COALESCE($2, title_english),
         description = COALESCE($3, description),
         cover_url = COALESCE($4, cover_url),
         banner_url = COALESCE($5, banner_url),
         year = COALESCE($6, year),
         status = COALESCE($7, status),
         type = COALESCE($8, type),
         episodes_count = COALESCE($9, episodes_count),
         is_hidden = COALESCE($10, is_hidden),
         slug = COALESCE($11, slug),
         updated_at = NOW()
       WHERE id = $12`,
      [title, titleEnglish, description, coverUrl, bannerUrl, year, status, type,
       episodesCount, isHidden, slug, id]
    );

    res.json({ message: 'Anime atualizado.' });
  } catch (err) { next(err); }
}

async function adminDeleteAnime(req, res, next) {
  try {
    await query('UPDATE anime SET is_hidden = true WHERE id = $1', [req.params.id]);
    res.json({ message: 'Anime ocultado.' });
  } catch (err) { next(err); }
}

// ─── Admin — Episódios ────────────────────────────────────────
async function adminGetEpisodes(req, res, next) {
  try {
    const { animeId, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [animeId, parseInt(limit), offset];

    const result = await query(
      `SELECT e.id, e.episode_number, e.season_number, e.title, e.duration,
              e.thumbnail_url, e.is_hidden, e.created_at,
              (SELECT COUNT(*) FROM episode_sources es WHERE es.episode_id = e.id) AS sources_count
       FROM episodes e
       WHERE e.anime_id = $1
       ORDER BY e.season_number ASC, e.episode_number ASC
       LIMIT $2 OFFSET $3`,
      params
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

async function adminCreateEpisode(req, res, next) {
  try {
    const {
      animeId, seasonId, seasonNumber, episodeNumber,
      title, description, thumbnailUrl, duration, airDate,
    } = req.body;

    const result = await query(
      `INSERT INTO episodes
         (anime_id, season_id, season_number, episode_number, title, description, thumbnail_url, duration, air_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [animeId, seasonId || null, seasonNumber || 1, episodeNumber, title, description, thumbnailUrl, duration, airDate]
    );

    // Atualiza contagem
    await query(
      `UPDATE anime SET episodes_count = (SELECT COUNT(*) FROM episodes WHERE anime_id = $1 AND is_hidden = false)
       WHERE id = $1`,
      [animeId]
    );

    res.status(201).json({ message: 'Episódio criado.', id: result.rows[0].id });
  } catch (err) { next(err); }
}

async function adminUpdateEpisode(req, res, next) {
  try {
    const { id } = req.params;
    const { episodeNumber, seasonNumber, title, description, thumbnailUrl, duration, isHidden } = req.body;

    await query(
      `UPDATE episodes SET
         episode_number = COALESCE($1, episode_number),
         season_number = COALESCE($2, season_number),
         title = COALESCE($3, title),
         description = COALESCE($4, description),
         thumbnail_url = COALESCE($5, thumbnail_url),
         duration = COALESCE($6, duration),
         is_hidden = COALESCE($7, is_hidden),
         updated_at = NOW()
       WHERE id = $8`,
      [episodeNumber, seasonNumber, title, description, thumbnailUrl, duration, isHidden, id]
    );

    res.json({ message: 'Episódio atualizado.' });
  } catch (err) { next(err); }
}

// ─── Admin — Fontes de Vídeo ──────────────────────────────────
async function adminGetSources(req, res, next) {
  try {
    const { episodeId } = req.params;
    const result = await query(
      `SELECT id, label, source_type, url, quality, language, is_default, provider_name, sort_order
       FROM episode_sources WHERE episode_id = $1 ORDER BY is_default DESC, sort_order ASC`,
      [episodeId]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

async function adminCreateSource(req, res, next) {
  try {
    const { episodeId } = req.params;
    const { label, sourceType, url, quality, language, isDefault, providerName, sortOrder } = req.body;

    if (isDefault) {
      await query(
        'UPDATE episode_sources SET is_default = false WHERE episode_id = $1',
        [episodeId]
      );
    }

    const result = await query(
      `INSERT INTO episode_sources
         (episode_id, label, source_type, url, quality, language, is_default, provider_name, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [episodeId, label, sourceType || 'embed', url, quality || '1080p',
       language || 'legendado', isDefault || false, providerName, sortOrder || 0]
    );

    res.status(201).json({ message: 'Fonte adicionada.', id: result.rows[0].id });
  } catch (err) { next(err); }
}

async function adminDeleteSource(req, res, next) {
  try {
    await query('DELETE FROM episode_sources WHERE id = $1', [req.params.sourceId]);
    res.json({ message: 'Fonte removida.' });
  } catch (err) { next(err); }
}

// ─── Tickets de Suporte ───────────────────────────────────────
async function getTickets(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let where = '';

    if (status) { params.push(status); where = 'WHERE t.status = $1'; }
    params.push(parseInt(limit)); params.push(offset);

    const result = await query(
      `SELECT t.id, t.subject, t.category, t.status, t.priority, t.created_at,
              u.username, u.email
       FROM support_tickets t
       LEFT JOIN users u ON u.id = t.user_id
       ${where}
       ORDER BY t.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

async function replyTicket(req, res, next) {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    await query(
      `UPDATE support_tickets SET
         admin_reply = $1, status = COALESCE($2, status), updated_at = NOW()
       WHERE id = $3`,
      [reply, status, id]
    );

    res.json({ message: 'Resposta enviada.' });
  } catch (err) { next(err); }
}

// ─── Sync Logs ────────────────────────────────────────────────
async function getSyncLogs(req, res, next) {
  try {
    const result = await query(
      `SELECT * FROM sync_logs ORDER BY started_at DESC LIMIT 20`
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
}

module.exports = {
  getDashboard, getUsers, updateUser,
  getSecurityLogs, getLoginAttempts,
  adminGetAnimes, adminUpdateAnime, adminDeleteAnime,
  adminGetEpisodes, adminCreateEpisode, adminUpdateEpisode,
  adminGetSources, adminCreateSource, adminDeleteSource,
  getTickets, replyTicket, getSyncLogs,
};
