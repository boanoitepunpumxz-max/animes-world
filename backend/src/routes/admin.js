psql.exe : psql: erro: a conexπo com o servidor em 
"ep-icy-feather-axnteatt.c-4.us-east-2.aws.neon.tech" (13.58.18.166), porta 5432 falhou: o servidor 
fechou a conexπo de forma nπo esperada
No linha:1 caractere:1
+ & $PSQL -h "ep-icy-feather-axnteatt.c-4.us-east-2.aws.neon.tech" -p 5 ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (psql: erro: a c...ma nπo esperada:String) [], RemoteExce 
   ption
    + FullyQualifiedErrorId : NativeCommandError
 
        Isso provavelmente significa que o servidor     foi encerrado de forma nπo normal antes ou
        durante o processamento da solicitaτπo.const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');
const ticketCtrl = require('../controllers/ticketController');
const { query } = require('../utils/db');

// Todos os endpoints admin exigem autenticação + role admin
router.use(authenticateToken, requireAdmin);

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

// Suporte — novo sistema com chat
router.get('/tickets', ticketCtrl.adminGetTickets);
router.patch('/tickets/:id', ticketCtrl.adminReplyTicket);
router.patch('/tickets/:id/status', ticketCtrl.updateTicketStatus);
router.patch('/tickets/:id/assign', ticketCtrl.assignTicket);
router.get('/tickets/:id', ticketCtrl.getTicket);
router.get('/tickets/:id/messages', ticketCtrl.getMessages);
router.post('/tickets/:id/messages', ticketCtrl.sendMessage);

// ── Manutenção do banco (limpeza de duplicados) ──────────────
router.post('/maintenance/clean-duplicates', async (req, res, next) => {
  try {
    // Conta antes
    const before = await query('SELECT COUNT(*) FROM anime');

    // Remove duplicados por external_id (mantém o com capa + mais popular)
    await query(`
      DELETE FROM anime_genres WHERE anime_id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY external_id
            ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC
          ) rn FROM anime WHERE external_id IS NOT NULL
        ) t WHERE rn > 1
      )
    `);
    await query(`
      DELETE FROM seasons WHERE anime_id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY external_id
            ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC
          ) rn FROM anime WHERE external_id IS NOT NULL
        ) t WHERE rn > 1
      )
    `);
    const dupResult = await query(`
      DELETE FROM anime WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY external_id
            ORDER BY (CASE WHEN cover_url IS NOT NULL AND cover_url!='' THEN 0 ELSE 1 END), popularity DESC NULLS LAST, created_at ASC
          ) rn FROM anime WHERE external_id IS NOT NULL
        ) t WHERE rn > 1
      )
    `);

    // Remove duplicados por slug
    await query(`
      DELETE FROM anime_genres WHERE anime_id IN (
        SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST) rn FROM anime) t WHERE rn > 1
      )
    `);
    await query(`
      DELETE FROM seasons WHERE anime_id IN (
        SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST) rn FROM anime) t WHERE rn > 1
      )
    `);
    const slugDups = await query(`
      DELETE FROM anime WHERE id IN (
        SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY (CASE WHEN cover_url IS NOT NULL THEN 0 ELSE 1 END), popularity DESC NULLS LAST) rn FROM anime) t WHERE rn > 1
      )
    `);

    // Remove sem capa sem interação
    await query(`
      DELETE FROM anime_genres WHERE anime_id IN (
        SELECT a.id FROM anime a
        WHERE (a.cover_url IS NULL OR a.cover_url='')
        AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id=a.id)
      )
    `);
    await query(`
      DELETE FROM seasons WHERE anime_id IN (
        SELECT a.id FROM anime a
        WHERE (a.cover_url IS NULL OR a.cover_url='')
        AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id=a.id)
        AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id=a.id)
      )
    `);
    const noCoverResult = await query(`
      DELETE FROM anime
      WHERE (cover_url IS NULL OR cover_url='')
      AND NOT EXISTS (SELECT 1 FROM episodes e WHERE e.anime_id=anime.id)
      AND NOT EXISTS (SELECT 1 FROM favorites f WHERE f.anime_id=anime.id)
      AND NOT EXISTS (SELECT 1 FROM watch_history wh WHERE wh.anime_id=anime.id)
      AND NOT EXISTS (SELECT 1 FROM watchlist wl WHERE wl.anime_id=anime.id)
    `);

    // Conta depois
    const after = await query('SELECT COUNT(*) FROM anime');
    const dupsCheck = await query(`
      SELECT COUNT(*) FROM (
        SELECT external_id FROM anime WHERE external_id IS NOT NULL
        GROUP BY external_id HAVING COUNT(*)>1
      ) x
    `);
    const noCoverCheck = await query(
      "SELECT COUNT(*) FROM anime WHERE cover_url IS NULL OR cover_url=''"
    );

    res.json({
      antes: parseInt(before.rows[0].count),
      depois: parseInt(after.rows[0].count),
      removidos_dups_ext: dupResult.rowCount,
      removidos_dups_slug: slugDups.rowCount,
      removidos_sem_capa: noCoverResult.rowCount,
      dups_restantes: parseInt(dupsCheck.rows[0].count),
      sem_capa_restantes: parseInt(noCoverCheck.rows[0].count),
    });
  } catch (err) { next(err); }
});

// Sync
router.get('/sync/logs', ctrl.getSyncLogs);
router.post('/sync/trigger', require('../services/anilistService').triggerSync);

module.exports = router;
