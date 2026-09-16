const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controller');
const userResolver = require('../middlewares/userResolver');

// GET /api/v1/playlists - Get public & user playlists
router.get('/', userResolver, playlistController.getAllPlaylists);

// POST /api/v1/playlists - Create new playlist
router.post('/', userResolver, playlistController.createPlaylist);

// GET /api/v1/playlists/:id - Playlist details with songs
router.get('/:id', playlistController.getPlaylistById);

// PUT /api/v1/playlists/:id - Full update
router.put('/:id', userResolver, playlistController.updatePlaylist);

// PATCH /api/v1/playlists/:id - Partial update
router.patch('/:id', userResolver, playlistController.updatePlaylist);

// DELETE /api/v1/playlists/:id - Delete playlist
router.delete('/:id', userResolver, playlistController.deletePlaylist);

// POST /api/v1/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', userResolver, playlistController.addSongToPlaylist);

// DELETE /api/v1/playlists/:id/songs/:songId - Remove song from playlist
router.delete('/:id/songs/:songId', userResolver, playlistController.removeSongFromPlaylist);

module.exports = router;
