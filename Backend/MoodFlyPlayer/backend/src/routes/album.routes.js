const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');

// GET /api/v1/albums - Browse albums
router.get('/', albumController.getAllAlbums);

// GET /api/v1/albums/:id - Album details and tracklist
router.get('/:id', albumController.getAlbumById);

module.exports = router;
