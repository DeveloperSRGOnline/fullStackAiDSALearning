const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');

// GET /api/v1/songs/featured - Trending #1 and featured showcase tracks
router.get('/featured', songController.getFeaturedSongs);

// GET /api/v1/songs - Browse songs with filters (search, genre, mood, trending, etc.)
router.get('/', songController.getAllSongs);

// GET /api/v1/songs/:id - Song stream details
router.get('/:id', songController.getSongById);

module.exports = router;
