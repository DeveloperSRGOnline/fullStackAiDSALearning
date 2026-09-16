const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');

// GET /api/v1/artists - List artists with listener metrics
router.get('/', artistController.getAllArtists);

// GET /api/v1/artists/:id - Artist profile, top songs, and discography
router.get('/:id', artistController.getArtistById);

module.exports = router;
