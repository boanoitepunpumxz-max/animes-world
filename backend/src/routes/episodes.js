const express = require('express');
const router = express.Router();
const { getEpisodesBySeason, getAllEpisodes, getEpisode, saveProgress } = require('../controllers/episodeController');
const { optionalAuth } = require('../middleware/auth');

router.get('/:animeId/season/:season', optionalAuth, getEpisodesBySeason);
router.get('/:animeId/all', getAllEpisodes);
router.get('/detail/:episodeId', optionalAuth, getEpisode);
router.post('/:episodeId/progress', saveProgress);

module.exports = router;
