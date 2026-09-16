const mongoose = require('mongoose');
const { Album } = require('../models');

/**
 * GET /api/v1/albums
 * Browse albums with artist and genre details
 */
async function getAllAlbums(req, res, next) {
  try {
    const { search, limit = 20 } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.title = new RegExp(search.trim(), 'i');
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const albums = await Album.find(query)
      .populate('artist', 'name avatar isVerified')
      .populate('genre', 'name vibeDescriptor accentColor')
      .sort({ releaseYear: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      count: albums.length,
      data: albums,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/albums/:id
 * Get album details and tracks
 */
async function getAlbumById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Album ID format',
      });
    }

    const album = await Album.findById(id)
      .populate('artist', 'name avatar isVerified bio')
      .populate('genre', 'name vibeDescriptor accentColor')
      .populate({
        path: 'songs',
        populate: {
          path: 'primaryArtist',
          select: 'name avatar',
        },
      })
      .lean();

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAlbums,
  getAlbumById,
};
