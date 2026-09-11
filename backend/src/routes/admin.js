const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');
const ticketCtrl = require('../controllers/ticketController');
const importerRoutes = require('./importer');
const importerAnibunkerRoutes = require('./importerAnibunker');
const { query } = require('../utils/db');
const axios = require('axios');

// Todos os endpoints admin exigem autenticacao + role admin
router.use(authenticateToken, requireAdmin);

// Importador Anibunker — DEVE vir ANTES do AnFireAPI
// (Express resolve a rota mais especifica primeiro)
router.use('/importer/anibunker', importerAnibunkerRoutes);

// Importador AnFireAPI (existente)
router.use('/importer', importerRoutes);

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Usuarios
router.get('/users', ctrl.getUsers);
router.patch('/users/:id', ctrl.updateUser);

// Seguranca / Logs
router.get('/security/logs', ctrl.getSecurityLogs);
router.get('/security/login-attempts', ctrl.getLoginAttempts);

// Animes
router.get('/anime', ctrl.adminGetAnimes);
router.patch('/anime/:id', ctrl.adminUpdateAnime);
router.delete('/anime/:id', ctrl.adminDeleteAnime);

// Episodios
router.get('/episodes', ctrl.adminGetEpisodes);
router.post('/episodes', ctrl.adminCreateEpisode);
router.patch('/episodes/:id', ctrl.adminUpdateEpisode);

// Fontes de Video
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

// Manutencao: popula AniXo (embed player sem bloqueio de iframe)
// Converte MAL ID -> AniList ID e cria episode_sources com embed do AniXo
router.post('/maintenance/populate-anixo', async (req, res, next) => {
  try {
    const { limit = 100 } = req.body;
    const ANIXO = 'https://anixo.buzz/embed/ani';

    const animes = await query(
      `SELECT DISTINCT a.id, a.title, a.external_id
       FROM anime a
       JOIN episodes e ON e.anime_id = a.id
       WHERE a.external_id IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM episode_sources es
           JOIN episodes ep2 ON ep2.id = es.episode_id
           WHERE ep2.anime_id = a.id AND es.provider_name = 'anixo'
           LIMIT 1
         )
       ORDER BY a.popularity DESC NULLS LAST
       LIMIT $1`,
      [parseInt(limit)]
    );

    let processed = 0, totalAdded = 0, failed = 0;
    const results = [];

    for (const anime of animes.rows) {
      let anilistId = null;
      try {
        await new Promise(r => setTimeout(r, 700));
        const gql = await axios.post(
          'https://graphql.anilist.co',
          { query: 'query($m:Int){Media(idMal:$m,type:ANIME){id}}', variables: { m: parseInt(anime.external_id) } },
          { headers: { 'Content-Type': 'application/json' }, timeout: 8000 }
        );
        anilistId = gql.data && gql.data.data && gql.data.data.Media ? gql.data.data.Media.id : null;
      } catch (_) { /* falha silenciosa */ }

      if (!anilistId) { failed++; continue; }

      const eps = await query(
        `SELECT id, episode_number FROM episodes WHERE anime_id=$1 AND is_hidden=false ORDER BY episode_number`,
        [anime.id]
      );

      let added = 0;
      for (const ep of eps.rows) {
        const epNum = Math.floor(ep.episode_number);
        if (epNum <= 0) continue;

        await query(
          `DELETE FROM episode_sources WHERE episode_id=$1 AND provider_name='anibunker'`,
          [ep.id]
        ).catch(() => {});

        const r1 = await query(
          `INSERT INTO episode_sources (episode_id, label, source_type, url, quality, language, is_default, provider_name)
           VALUES ($1, 'Legendado', 'embed', $2, 'auto', 'legendado', true, 'anixo')
           ON CONFLICT DO NOTHING RETURNING id`,
          [ep.id, ANIXO + '/' + anilistId + '/' + epNum + '/sub']
        );
        const r2 = await query(
          `INSERT INTO episode_sources (episode_id, label, source_type, url, quality, language, is_default, provider_name)
           VALUES ($1, 'Dublado', 'embed', $2, 'auto', 'dublado', false, 'anixo')
           ON CONFLICT DO NOTHING RETURNING id`,
          [ep.id, ANIXO + '/' + anilistId + '/' + epNum + '/dub']
        );
        added += (r1.rowCount || 0) + (r2.rowCount || 0);
      }

      totalAdded += added;
      processed++;
      results.push({ title: anime.title, anilistId, eps: eps.rows.length, sourcesAdded: added });
    }

    const stats = await query(`SELECT COUNT(*) FROM episode_sources WHERE provider_name='anixo'`);
    res.json({ processed, failed, totalAdded, totalAnixoSources: parseInt(stats.rows[0].count), results: results.slice(0, 20) });
  } catch (err) { next(err); }
});

// Manutencao: limpa duplicados
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

// Manutencao: atualiza capas com Kitsu (batch)
router.post('/maintenance/fix-covers', async (req, res, next) => {
  try {
    const { limit = 200, offset = 0 } = req.body;

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
          'https://kitsu.app/api/edge/mappings?filter[externalSite]=myanimelist%2Fanime&filter[externalId]=' + ids + '&include=item&page[limit]=20',
          { timeout: 10000, headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AnimesWorld/1.0' } }
        );

        const included = kitsuResp.data && kitsuResp.data.included ? kitsuResp.data.included : [];
        const imageMap = {};
        included.forEach(item => {
          imageMap[item.id] = {
            cover: (item.attributes && item.attributes.posterImage) ? (item.attributes.posterImage.large || item.attributes.posterImage.medium) : null,
            banner: (item.attributes && item.attributes.coverImage) ? item.attributes.coverImage.large : null,
          };
        });

        const data = (kitsuResp.data && kitsuResp.data.data) ? kitsuResp.data.data : [];
        for (const mapping of data) {
          const malId = mapping.attributes && mapping.attributes.externalId;
          const kitsuId = mapping.relationships && mapping.relationships.item && mapping.relationships.item.data ? mapping.relationships.item.data.id : null;
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
