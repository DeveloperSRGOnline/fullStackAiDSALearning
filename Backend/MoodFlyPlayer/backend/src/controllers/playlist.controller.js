const mongoose = require('mongoose');
const { Playlist, Song } = require('../models');

/**
 * GET /api/v1/playlists
 * Get public & user playlists with filter options
 */
async function getAllPlaylists(req, res, next) {
  try {
    const { moodSyncDynamic, targetMood, search, isPublic } = req.query;
    const query = {};

    // Filter by visibility or ownership
    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true' || isPublic === true;
    } else if (req.userId) {
      query.$or = [{ isPublic: true }, { user: req.userId }];
    } else {
      query.isPublic = true;
    }

    if (moodSyncDynamic !== undefined) {
      query.moodSyncDynamic =
        moodSyncDynamic === 'true' || moodSyncDynamic === true;
    }

    if (targetMood && targetMood.trim()) {
      query.targetMood = new RegExp(targetMood.trim(), 'i');
    }

    if (search && search.trim()) {
      query.name = new RegExp(search.trim(), 'i');
    }

    const playlists = await Playlist.find(query)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        select: 'title artistNames coverImage duration durationFormatted audioUrl playCount',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Map totalSongs if needed
    const result = playlists.map((pl) => ({
      ...pl,
      totalSongs: pl.songs ? pl.songs.length : 0,
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/playlists
 * Create a new playlist (supports moodSyncDynamic toggle, icons, colors)
 */
async function createPlaylist(req, res, next) {
  try {
    const {
      name,
      description,
      coverImage,
      isPublic = true,
      moodSyncDynamic = false,
      sidebarIcon = 'queue_music',
      accentColor = '#10b981',
      targetMood = '',
      songs = [],
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Playlist name is required',
      });
    }

    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: 'User is required to create a playlist',
      });
    }

    // Format initial songs array if provided as IDs or objects
    const formattedSongs = [];
    if (Array.isArray(songs)) {
      for (const item of songs) {
        const songId = typeof item === 'object' && item.song ? item.song : item;
        if (mongoose.Types.ObjectId.isValid(songId)) {
          formattedSongs.push({
            song: songId,
            addedAt: new Date(),
          });
        }
      }
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      ...(coverImage && { coverImage: coverImage.trim() }),
      user: req.userId,
      isPublic: isPublic === true || isPublic === 'true',
      moodSyncDynamic: moodSyncDynamic === true || moodSyncDynamic === 'true',
      sidebarIcon: sidebarIcon || 'queue_music',
      accentColor: accentColor || '#10b981',
      targetMood: targetMood ? targetMood.trim() : '',
      songs: formattedSongs,
    });

    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        select: 'title artistNames coverImage duration durationFormatted audioUrl',
      })
      .lean();

    res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      data: populatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/playlists/:id
 * Get playlist details & song table
 */
async function getPlaylistById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Playlist ID format',
      });
    }

    const playlist = await Playlist.findById(id)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        populate: [
          { path: 'primaryArtist', select: 'name avatar isVerified' },
          { path: 'album', select: 'title coverImage' },
          { path: 'genres', select: 'name vibeDescriptor accentColor' },
        ],
      })
      .lean();

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...playlist,
        totalSongs: playlist.songs ? playlist.songs.length : 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT or PATCH /api/v1/playlists/:id
 * Update playlist details
 */
async function updatePlaylist(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Playlist ID format',
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    const updatableFields = [
      'name',
      'description',
      'coverImage',
      'isPublic',
      'moodSyncDynamic',
      'sidebarIcon',
      'accentColor',
      'targetMood',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        playlist[field] = req.body[field];
      }
    });

    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        populate: [
          { path: 'primaryArtist', select: 'name avatar isVerified' },
          { path: 'album', select: 'title coverImage' },
        ],
      })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Playlist updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/playlists/:id
 * Delete playlist
 */
async function deletePlaylist(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Playlist ID format',
      });
    }

    const playlist = await Playlist.findByIdAndDelete(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/playlists/:id/songs
 * Add track to playlist
 */
async function addSongToPlaylist(req, res, next) {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Playlist ID format',
      });
    }

    if (!songId || !mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid songId is required in request body',
      });
    }

    const [playlist, song] = await Promise.all([
      Playlist.findById(id),
      Song.findById(songId),
    ]);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }

    // Check if song already exists in playlist
    const alreadyExists = playlist.songs.some(
      (item) => item.song.toString() === songId.toString()
    );

    if (alreadyExists) {
      return res.status(200).json({
        success: true,
        message: 'Song is already in this playlist',
        data: playlist,
      });
    }

    playlist.songs.push({
      song: song._id,
      addedAt: new Date(),
    });

    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        populate: [{ path: 'primaryArtist', select: 'name avatar' }],
      })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Song added to playlist',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/playlists/:id/songs/:songId
 * Remove track from playlist
 */
async function removeSongFromPlaylist(req, res, next) {
  try {
    const { id, songId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Playlist ID or Song ID format',
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    const initialLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter(
      (item) => item.song.toString() !== songId.toString()
    );

    if (playlist.songs.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Song was not in this playlist',
      });
    }

    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('user', 'name avatar email')
      .populate({
        path: 'songs.song',
        populate: [{ path: 'primaryArtist', select: 'name avatar' }],
      })
      .lean();

    res.status(200).json({
      success: true,
      message: 'Song removed from playlist',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPlaylists,
  createPlaylist,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
