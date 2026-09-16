const mongoose = require('mongoose');
const { Song, Genre } = require('../models');

/**
 * GET /api/v1/songs
 * Fetch songs with comprehensive filtering, search, pagination, and sorting
 */
async function getAllSongs(req, res, next) {
  try {
    const {
      search,
      q,
      genre,
      mood,
      energyLevel,
      minEnergy,
      maxEnergy,
      featured,
      trending,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    const searchTerm = search || q;

    // 1. Text Search (title, artist names, album title, lyrics)
    if (searchTerm && searchTerm.trim()) {
      const regex = new RegExp(searchTerm.trim(), 'i');
      query.$or = [
        { title: regex },
        { artistNames: regex },
        { albumTitle: regex },
        { lyrics: regex },
      ];
    }

    // 2. Genre Filter (by genre ObjectId or name)
    if (genre && genre.trim()) {
      if (mongoose.Types.ObjectId.isValid(genre.trim())) {
        query.genres = genre.trim();
      } else {
        const foundGenre = await Genre.findOne({
          name: new RegExp(`^${genre.trim()}$`, 'i'),
        });
        if (foundGenre) {
          query.genres = foundGenre._id;
        }
      }
    }

    // 3. Mood Tag Filter (case-insensitive search in moodTags array)
    if (mood && mood.trim()) {
      query.moodTags = { $regex: new RegExp(mood.trim(), 'i') };
    }

    // 4. Energy Level Filter
    if (energyLevel) {
      query.energyLevel = Number(energyLevel);
    } else if (minEnergy || maxEnergy) {
      query.energyLevel = {};
      if (minEnergy) query.energyLevel.$gte = Number(minEnergy);
      if (maxEnergy) query.energyLevel.$lte = Number(maxEnergy);
    }

    // 5. Featured Filter
    if (featured !== undefined) {
      query.isFeatured = featured === 'true' || featured === true;
    }

    // 6. Trending Filter
    if (trending === 'true' || trending === true) {
      query.trendingRank = { $ne: null };
    }

    // 7. Sorting Strategy
    let sortOption = { createdAt: -1 };
    if (sort === 'trending') {
      sortOption = { trendingRank: 1, playCount: -1 };
    } else if (sort === 'popular') {
      sortOption = { playCount: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'energy') {
      sortOption = { energyLevel: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [songs, total] = await Promise.all([
      Song.find(query)
        .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
        .populate('featuredArtists', 'name avatar isVerified')
        .populate('album', 'title coverImage releaseYear')
        .populate('genres', 'name vibeDescriptor accentColor')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Song.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/songs/featured
 * Get trending hero release (#1 featured track) and featured showcase list
 */
async function getFeaturedSongs(req, res, next) {
  try {
    const featuredSongs = await Song.find({
      $or: [{ isFeatured: true }, { trendingRank: { $ne: null } }],
    })
      .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
      .populate('album', 'title coverImage releaseYear')
      .populate('genres', 'name vibeDescriptor accentColor')
      .sort({ trendingRank: 1, playCount: -1 })
      .limit(10)
      .lean();

    const hero = featuredSongs.length > 0 ? featuredSongs[0] : null;

    res.status(200).json({
      success: true,
      hero,
      count: featuredSongs.length,
      data: featuredSongs,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/songs/:id
 * Get single song details & stream metadata
 */
async function getSongById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Song ID format',
      });
    }

    const song = await Song.findById(id)
      .populate('primaryArtist', 'name avatar bio monthlyListenersDisplay isVerified socialLinks')
      .populate('featuredArtists', 'name avatar isVerified')
      .populate('album', 'title coverImage releaseYear totalTracks')
      .populate('genres', 'name vibeDescriptor accentColor coverImage')
      .lean();

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllSongs,
  getFeaturedSongs,
  getSongById,
};
