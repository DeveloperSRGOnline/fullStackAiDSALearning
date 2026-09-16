const mongoose = require('mongoose');
const { Favorite, Recent, Song } = require('../models');

/**
 * POST /api/v1/library/favorites/toggle
 * Instant heart button action: toggle favorite state for a song
 */
async function toggleFavorite(req, res, next) {
  try {
    const { songId } = req.body;

    if (!songId || !mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid songId is required',
      });
    }

    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: 'User is required to toggle favorites',
      });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    const existingFavorite = await Favorite.findOne({
      user: req.userId,
      song: songId,
    });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({
        success: true,
        isFavorited: false,
        message: 'Song removed from favorites',
        songId,
      });
    } else {
      const newFavorite = await Favorite.create({
        user: req.userId,
        song: songId,
        favoritedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        isFavorited: true,
        message: 'Song added to favorites',
        songId,
        favoriteId: newFavorite._id,
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/library/favorites
 * Fetch all songs favorited by current user
 */
async function getFavorites(req, res, next) {
  try {
    if (!req.userId) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const favorites = await Favorite.find({ user: req.userId })
      .populate({
        path: 'song',
        populate: [
          { path: 'primaryArtist', select: 'name avatar monthlyListenersDisplay isVerified' },
          { path: 'album', select: 'title coverImage releaseYear' },
          { path: 'genres', select: 'name vibeDescriptor accentColor' },
        ],
      })
      .sort({ favoritedAt: -1 })
      .lean();

    // Filter out deleted songs if any
    const activeFavorites = favorites.filter((f) => f.song != null);

    res.status(200).json({
      success: true,
      count: activeFavorites.length,
      data: activeFavorites.map((f) => ({
        favoriteId: f._id,
        favoritedAt: f.favoritedAt,
        song: f.song,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/library/recents
 * Fetch listening history / recently played songs
 */
async function getRecents(req, res, next) {
  try {
    const { limit = 30 } = req.query;

    if (!req.userId) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 30));

    const recents = await Recent.find({ user: req.userId })
      .populate({
        path: 'song',
        populate: [
          { path: 'primaryArtist', select: 'name avatar monthlyListenersDisplay isVerified' },
          { path: 'album', select: 'title coverImage releaseYear' },
          { path: 'genres', select: 'name vibeDescriptor accentColor' },
        ],
      })
      .sort({ playedAt: -1 })
      .limit(limitNum)
      .lean();

    // Filter out deleted songs
    const activeRecents = recents.filter((r) => r.song != null);

    res.status(200).json({
      success: true,
      count: activeRecents.length,
      data: activeRecents.map((r) => ({
        recentId: r._id,
        playedAt: r.playedAt,
        playedDuration: r.playedDuration,
        completed: r.completed,
        contextMood: r.contextMood,
        song: r.song,
      })),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/library/recents
 * Log a playback session / listen event and increment the song playCount
 */
async function logRecent(req, res, next) {
  try {
    const { songId, playedDuration = 0, completed = false, contextMood = '' } = req.body;

    if (!songId || !mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid songId is required',
      });
    }

    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: 'User is required to log playback',
      });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    // Increment playCount
    song.playCount = (song.playCount || 0) + 1;
    await song.save();

    // Create a new Recent history record
    const recentEntry = await Recent.create({
      user: req.userId,
      song: songId,
      playedDuration: Number(playedDuration) || 0,
      completed: completed === true || completed === 'true',
      contextMood: contextMood ? contextMood.trim() : '',
      playedAt: new Date(),
    });

    const populatedEntry = await Recent.findById(recentEntry._id)
      .populate('song')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Playback logged successfully',
      data: populatedEntry,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  toggleFavorite,
  getFavorites,
  getRecents,
  logRecent,
};
