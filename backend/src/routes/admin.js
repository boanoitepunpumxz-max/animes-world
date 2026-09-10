const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');
const ticketCtrl = require('../controllers/ticketController');
const importerRoutes = require('./importer');
const importerAnibunkerRoutes = require('./importerAnibunker');
const { query } = require('../utils/db');
const axios = require('axios');

// Todos os endpoints admin exigem autenticação + role admin
router.use(authenticateToken, requireAdmin);

// ── Importador Anibunker — DEVE vir ANTES do AnFireAPI ────────
// (Express resolve a rota mais específica primeiro)
router.use('/importer/anibunker', importerAnibunkerRoutes);

// ── Importador AnFireAPI (existente) ──────────────────────────
router.use('/importer', importerRoutes);

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Usuários
router.get('/users', ctrl.getUsers);
router.patch('/users/:id', ctrl.updateUser);

// Segurança / Logs
router.get('/security/logs', ctrl.getSecurityLogs);
router.get('/security/login-attempts', ctrl.getLoginAttempts);

// Animes
router.get('/anime', ctrl.adminGetAnimes);
router.patch('/anime/:id', ctrl.adminUpdateAnime);
router.delete('/anime/:id', ctrl.adminDeleteAnime);

// Episódios
router.get('/episodes', ctrl.adminGetEpisodes);
router.post('/episodes', ctrl.adminCreateEpisode);
router.patch('/episodes/:id', ctrl.adminUpdateEpisode);

// Fontes de Vídeo
router.get('/episodes/:episodeId/sources', ctrl.adminGetSources);
router.post('/episodes/:episodeId/sources', ctrl.adminCreateSource);
router.delete('/episodes/:episodeId/sources/:sourceId', ctrl.adminDeleteSource);

// Suporte — sistema com chat
router.get('/tickets', ticketCtrl.adminGetTickets);
router.patch('/tickets/:id', ticketCtrl.adminReplyTicket);
router.patch('/tickets/:id/status', ticketCtrl.updateTicketStatus);
router.patch('/tickets/:id/assign', ticketCtrl.assignTicket);
router.get('/tickets/:id', ticketCtrl.getTicket);
router.get('/tickets/:id/messages', ticketCtrl.getMessages);
router.post('/tickets/:id/messages', ticketCtrl.sendMessage);

// ── Manutenção: limpa duplicados ─────────────────────────────
router.post('/maintenance/clean-duplicates', async (req, res, next) => {
  try {
    const before = await query('SELECT COUNT(*) FROM anime');
    await query(`DELETE FROM anime_genres WHERE anime_id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) rn FROM anime WHERE external_id IS NOT NULL) t WHERE rn > 1)`);
    await query(`DELETE FROM seasons WHERE anime_id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) rn FROM anime WHERE external_id IS NOT NULL) t WHERE rn > 1)`);
    const dupResult = await query(`DELETE FROM anime WHERE id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY external_id ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC) rn FROM anime WHERE external_id IS NOT NULL) t WHERE rn > 1)`);
    const after = await query('SELECT COUNT(*) FROM anime');
    res.json({ antes: parseInt(before.rows[0].count), depois: parseInt(after.rows[0].count), removidos: dupResult.rowCount });
  } catch (err) { next(err); }
});

// ── Manutenção: atualiza capas com Kitsu (batch) ─────────────
router.post('/maintenance/fix-covers', async (req, res, next) => {
  try {
    const { limit = 200, offset = 0 } = req.body;

    // Busca animes com capas AniList (quebradas) ou sem capa
    const animes = await query(
      `SELECT id, external_id, title FROM anime
       WHERE external_id IS NOT NULL
         AND (cover_url IS NULL OR cover_url='' OR cover_url LIKE '%anilist%' OR cover_url LIKE '%myanimelist.net/images/anime/%/%l.jpg')
       ORDER BY popularity DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );

    let updated = 0, failed = 0;
    const BATCH = 20;

    for (let i = 0; i < animes.rows.length; i += BATCH) {
      const batch = animes.rows.slice(i, i + BATCH);
      const ids = batch.map(a => a.external_id).join(',');

      try {
        const kitsuResp = await axios.get(
          `https://kitsu.app/api/edge/mappings?filter[externalSite]=myanimelist%2Fanime&filter[externalId]=${ids}&include=item&page[limit]=20`,
          { timeout: 10000, headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' } }
        );

        const included = kitsuResp.data?.included || [];
        const imageMap = {};
        included.forEach(item => { imageMap[item.id] = { cover: item.attributes?.posterImage?.large || item.attributes?.posterImage?.medium, banner: item.attributes?.coverImage?.large }; });

        const data = kitsuResp.data?.data || [];
        for (const mapping of data) {
          const malId = mapping.attributes?.externalId;
          const kitsuId = mapping.relationships?.item?.data?.id;
          if (!malId || !kitsuId || !imageMap[kitsuId]) continue;
          const imgs = imageMap[kitsuId];
          if (!imgs.cover) continue;
          await query(
            `UPDATE anime SET cover_url=$1, banner_url=COALESCE($2, banner_url), updated_at=NOW() WHERE external_id=$3`,
            [imgs.cover, imgs.banner, malId]
          );
          updated++;
        }
      } catch (_) { failed += batch.length; }

      await new Promise(r => setTimeout(r, 500));
    }

    const remaining = await query(
      `SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url='' OR cover_url LIKE '%anilist%'`
    );

    res.json({
      processados: animes.rows.length,
      atualizados: updated,
      falhas: failed,
      ainda_sem_capa: parseInt(remaining.rows[0].count),
      offset_proximo: parseInt(offset) + parseInt(limit),
    });
  } catch (err) { next(err); }
});

// Sync
router.get('/sync/logs', ctrl.getSyncLogs);
router.post('/sync/trigger', require('../services/anilistService').triggerSync);

module.exports = router;
