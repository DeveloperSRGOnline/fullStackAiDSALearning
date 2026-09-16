const express = require('express');
const router = express.Router();

const songRoutes = require('./song.routes');
const genreRoutes = require('./genre.routes');
const artistRoutes = require('./artist.routes');
const albumRoutes = require('./album.routes');
const moodRoutes = require('./mood.routes');
const playlistRoutes = require('./playlist.routes');
const libraryRoutes = require('./library.routes');

// Mount sub-routers on /api/v1/
router.use('/songs', songRoutes);
router.use('/genres', genreRoutes);
router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/moods', moodRoutes);
router.use('/mood', moodRoutes); // Alias for singular mood endpoints
router.use('/playlists', playlistRoutes);
router.use('/library', libraryRoutes);

module.exports = router;
