const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

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

// Suporte
router.get('/tickets', ctrl.getTickets);
router.patch('/tickets/:id', ctrl.replyTicket);

// Sync
router.get('/sync/logs', ctrl.getSyncLogs);
router.post('/sync/trigger', require('../services/anilistService').triggerSync);

module.exports = router;
