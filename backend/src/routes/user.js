const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');

router.get('/profile', ctrl.getProfile);
router.patch('/profile', ctrl.updateProfile);
router.patch('/password', ctrl.changePassword);
router.get('/history', ctrl.getHistory);
router.delete('/history', ctrl.clearHistory);
router.get('/continue-watching', ctrl.getContinueWatching);
router.get('/favorites', ctrl.getFavorites);
router.post('/favorites/:animeId', ctrl.toggleFavorite);
router.get('/watchlist', ctrl.getWatchlist);
router.post('/watchlist/:animeId', ctrl.updateWatchlist);
router.delete('/watchlist/:animeId', ctrl.removeFromWatchlist);
router.get('/settings', ctrl.getSettings);
router.put('/settings', ctrl.updateSettings);

module.exports = router;
