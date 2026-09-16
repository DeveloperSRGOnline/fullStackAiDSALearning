const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');
const userResolver = require('../middlewares/userResolver');

// Apply user resolution across all user library routes
router.use(userResolver);

// POST /api/v1/library/favorites/toggle - Instant heart button action
router.post('/favorites/toggle', libraryController.toggleFavorite);

// GET /api/v1/library/favorites - List user's favorite songs
router.get('/favorites', libraryController.getFavorites);

// GET /api/v1/library/recents - List recently played tracks
router.get('/recents', libraryController.getRecents);

// POST /api/v1/library/recents - Log playback session & increment playCount
router.post('/recents', libraryController.logRecent);

module.exports = router;
