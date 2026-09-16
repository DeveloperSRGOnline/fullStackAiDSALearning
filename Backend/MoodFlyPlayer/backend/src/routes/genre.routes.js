const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');

// GET /api/v1/genres - List vibe-based genres
router.get('/', genreController.getAllGenres);

// GET /api/v1/genres/:id - Single genre & songs
router.get('/:id', genreController.getGenreById);

module.exports = router;
