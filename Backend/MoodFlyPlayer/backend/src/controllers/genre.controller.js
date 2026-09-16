const mongoose = require('mongoose');
const { Genre, Song } = require('../models');

/**
 * GET /api/v1/genres
 * List vibe-based genres with visual styling tokens (accentColor, vibeDescriptor, coverImage)
 */
async function getAllGenres(req, res, next) {
  try {
    const genres = await Genre.find().sort({ isPopular: -1, name: 1 }).lean();

    // Optionally attach song count for each genre
    const genresWithCount = await Promise.all(
      genres.map(async (genre) => {
        const songCount = await Song.countDocuments({ genres: genre._id });
        return {
          ...genre,
          songCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: genresWithCount.length,
      data: genresWithCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/genres/:id
 * Get single genre details and songs belonging to it
 */
async function getGenreById(req, res, next) {
  try {
    const { id } = req.params;

    let genre = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      genre = await Genre.findById(id).lean();
    } else {
      genre = await Genre.findOne({
        name: new RegExp(`^${id.trim()}$`, 'i'),
      }).lean();
    }

    if (!genre) {
      return res.status(404).json({
        success: false,
        message: 'Genre not found',
      });
    }

    const songs = await Song.find({ genres: genre._id })
      .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
      .populate('album', 'title coverImage')
      .sort({ playCount: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...genre,
        songCount: songs.length,
        songs,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllGenres,
  getGenreById,
};
