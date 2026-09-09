const express = require('express');
const router = express.Router();
const { getAnimes, getAnimeBySlug, getFeatured, getPopular, getRecentEpisodes, getBySeason } = require('../controllers/animeController');
const { optionalAuth } = require('../middleware/auth');

router.get('/featured', getFeatured);
router.get('/popular', getPopular);
router.get('/recent-episodes', getRecentEpisodes);
router.get('/season/:year/:season', getBySeason);
router.get('/', getAnimes);
router.get('/:slug', optionalAuth, getAnimeBySlug);

module.exports = router;
