const mongoose = require('mongoose');
const { Artist, Song, Album } = require('../models');

/**
 * GET /api/v1/artists
 * List artists with monthly listener metrics and verification badges
 */
async function getAllArtists(req, res, next) {
  try {
    const { search, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const artists = await Artist.find(query)
      .populate('genres', 'name vibeDescriptor accentColor')
      .sort({ monthlyListeners: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      count: artists.length,
      data: artists,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/artists/:id
 * Get single artist details, top popular songs, and discography albums
 */
async function getArtistById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Artist ID format',
      });
    }

    const artist = await Artist.findById(id)
      .populate('genres', 'name vibeDescriptor accentColor')
      .lean();

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }

    // Fetch artist's songs & albums in parallel
    const [topSongs, albums] = await Promise.all([
      Song.find({ primaryArtist: artist._id })
        .populate('album', 'title coverImage releaseYear')
        .populate('genres', 'name vibeDescriptor accentColor')
        .sort({ playCount: -1 })
        .limit(10)
        .lean(),
      Album.find({ artist: artist._id })
        .sort({ releaseYear: -1 })
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...artist,
        topSongs,
        albums,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllArtists,
  getArtistById,
};
