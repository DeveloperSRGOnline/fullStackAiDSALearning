const mongoose = require('mongoose');
const { Song, MoodLog } = require('../models');

// Configuration for mapping biometric emotion detections to Moodfly audio profiles
const MOOD_MAPPINGS = {
  happy: {
    normalizedMood: 'happy',
    displayMood: 'Joy',
    emoji: '✨',
    hudLabel: 'Uplifted & Vibrant ✨',
    tags: ['Joy', 'Euphoric', 'Vibrant', 'Happy'],
    energyRange: [6, 10],
    accentColor: '#10b981',
  },
  joy: {
    normalizedMood: 'happy',
    displayMood: 'Joy',
    emoji: '✨',
    hudLabel: 'Uplifted & Vibrant ✨',
    tags: ['Joy', 'Euphoric', 'Vibrant', 'Happy'],
    energyRange: [6, 10],
    accentColor: '#10b981',
  },
  surprised: {
    normalizedMood: 'surprised',
    displayMood: 'Energy',
    emoji: '⚡',
    hudLabel: 'Ecstatic & Electrified ⚡',
    tags: ['Energy', 'Euphoric', 'Vibrant'],
    energyRange: [7, 10],
    accentColor: '#06b6d4',
  },
  energy: {
    normalizedMood: 'energy',
    displayMood: 'Energy',
    emoji: '⚡',
    hudLabel: 'High Voltage & Peak Energy ⚡',
    tags: ['Energy', 'Euphoric', 'Vibrant'],
    energyRange: [7, 10],
    accentColor: '#ef4444',
  },
  energetic: {
    normalizedMood: 'energy',
    displayMood: 'Energy',
    emoji: '⚡',
    hudLabel: 'High Voltage & Peak Energy ⚡',
    tags: ['Energy', 'Euphoric', 'Vibrant'],
    energyRange: [7, 10],
    accentColor: '#ef4444',
  },
  neutral: {
    normalizedMood: 'neutral',
    displayMood: 'Calm',
    emoji: '🧘',
    hudLabel: 'Serene & Centered 🧘',
    tags: ['Calm', 'Relaxed', 'Focus', 'Lo-Fi'],
    energyRange: [2, 5],
    accentColor: '#3b82f6',
  },
  calm: {
    normalizedMood: 'calm',
    displayMood: 'Calm',
    emoji: '😌',
    hudLabel: 'Serene & Mindful 😌',
    tags: ['Calm', 'Relaxed', 'Focus', 'Lo-Fi'],
    energyRange: [1, 5],
    accentColor: '#3b82f6',
  },
  sad: {
    normalizedMood: 'sad',
    displayMood: 'Sorrow',
    emoji: '🌧️',
    hudLabel: 'Melancholic & Reflective 🌧️',
    tags: ['Sorrow', 'Melancholic', 'Calm'],
    energyRange: [1, 4],
    accentColor: '#8b5cf6',
  },
  sorrow: {
    normalizedMood: 'sad',
    displayMood: 'Sorrow',
    emoji: '🌧️',
    hudLabel: 'Melancholic & Reflective 🌧️',
    tags: ['Sorrow', 'Melancholic', 'Calm'],
    energyRange: [1, 4],
    accentColor: '#8b5cf6',
  },
  angry: {
    normalizedMood: 'angry',
    displayMood: 'Energy',
    emoji: '🔥',
    hudLabel: 'Intense Catharsis & Fire 🔥',
    tags: ['Energy', 'Focus'],
    energyRange: [7, 10],
    accentColor: '#f59e0b',
  },
  fearful: {
    normalizedMood: 'fearful',
    displayMood: 'Calm',
    emoji: '🌙',
    hudLabel: 'Comforting Sanctuary 🌙',
    tags: ['Calm', 'Relaxed', 'Lo-Fi'],
    energyRange: [1, 4],
    accentColor: '#6366f1',
  },
  disgusted: {
    normalizedMood: 'disgusted',
    displayMood: 'Focus',
    emoji: '⚡',
    hudLabel: 'Cleansing Resonance ⚡',
    tags: ['Energy', 'Focus', 'Calm'],
    energyRange: [4, 7],
    accentColor: '#14b8a6',
  },
  'lo-fi': {
    normalizedMood: 'lo-fi',
    displayMood: 'Lo-Fi',
    emoji: '🎧',
    hudLabel: 'Nocturnal Study & Lo-Fi 🎧',
    tags: ['Lo-Fi', 'Calm', 'Focus', 'Relaxed'],
    energyRange: [2, 4],
    accentColor: '#8b5cf6',
  },
  focus: {
    normalizedMood: 'focus',
    displayMood: 'Focus',
    emoji: '🎯',
    hudLabel: 'Deep Flow State 🎯',
    tags: ['Focus', 'Calm', 'Lo-Fi'],
    energyRange: [2, 5],
    accentColor: '#06b6d4',
  },
};

/**
 * Resolves emotion details from payload
 */
function resolveMoodDetails(body) {
  let detectedMoodKey = 'happy';
  let confidence = 0.92;

  // 1. Check direct mood or emotion string
  const rawMood = body.mood || body.emotion || body.detectedMood;
  if (rawMood && typeof rawMood === 'string') {
    detectedMoodKey = rawMood.trim().toLowerCase();
    if (typeof body.confidence === 'number') {
      confidence = Math.min(1, Math.max(0, body.confidence));
    }
  }
  // 2. Check expressions object (e.g. from face-api.js or webcam telemetry)
  else if (body.expressions && typeof body.expressions === 'object') {
    let highestScore = -1;
    for (const [key, score] of Object.entries(body.expressions)) {
      if (typeof score === 'number' && score > highestScore) {
        highestScore = score;
        detectedMoodKey = key.toLowerCase();
      }
    }
    if (highestScore > 0) {
      confidence = parseFloat(highestScore.toFixed(2));
    }
  }
  // 3. Check telemetry wrapper
  else if (body.telemetry && typeof body.telemetry === 'object') {
    return resolveMoodDetails(body.telemetry);
  }

  const moodConfig = MOOD_MAPPINGS[detectedMoodKey] || {
    normalizedMood: detectedMoodKey,
    displayMood: detectedMoodKey.charAt(0).toUpperCase() + detectedMoodKey.slice(1),
    emoji: '✨',
    hudLabel: `${detectedMoodKey.toUpperCase()} VIBE ✨`,
    tags: [detectedMoodKey],
    energyRange: [1, 10],
    accentColor: '#10b981',
  };

  return {
    detectedMoodKey,
    confidence,
    moodConfig,
  };
}

/**
 * POST /api/v1/moods/detect (and /api/v1/mood/detect)
 * Receives webcam facial emotion telemetry or mood string -> returns emotion HUD and curated songs
 */
async function detectMood(req, res, next) {
  try {
    const { detectedMoodKey, confidence, moodConfig } = resolveMoodDetails(req.body);
    const limitNum = Math.min(20, Math.max(1, parseInt(req.body.limit, 10) || 8));

    // Regex match tags
    const tagRegexes = moodConfig.tags.map((tag) => new RegExp(`^${tag}$`, 'i'));

    // Find songs matching tags or energy range
    let recommendations = await Song.find({
      $or: [
        { moodTags: { $in: tagRegexes } },
        {
          energyLevel: {
            $gte: moodConfig.energyRange[0],
            $lte: moodConfig.energyRange[1],
          },
        },
      ],
    })
      .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
      .populate('album', 'title coverImage releaseYear')
      .populate('genres', 'name vibeDescriptor accentColor')
      .sort({ playCount: -1 })
      .limit(limitNum)
      .lean();

    // If still empty or less than 4, backfill with top songs
    if (recommendations.length < 4) {
      const existingIds = recommendations.map((r) => r._id);
      const backfill = await Song.find({ _id: { $nin: existingIds } })
        .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
        .populate('album', 'title coverImage releaseYear')
        .populate('genres', 'name vibeDescriptor accentColor')
        .sort({ playCount: -1 })
        .limit(limitNum - recommendations.length)
        .lean();
      recommendations = recommendations.concat(backfill);
    }

    // Save detection event to MoodLog
    let moodLogRecord = null;
    try {
      moodLogRecord = await MoodLog.create({
        user: req.userId || undefined,
        mood: moodConfig.normalizedMood,
        emoji: moodConfig.emoji,
        confidence,
        recommendedSongs: recommendations.map((s) => s._id),
        selectedSong: recommendations.length > 0 ? recommendations[0]._id : undefined,
        detectionSource: req.body.detectionSource || 'webcam_scan',
      });
    } catch (logErr) {
      console.warn('⚠️ MoodLog creation notice:', logErr.message);
    }

    res.status(200).json({
      success: true,
      data: {
        detectedMood: detectedMoodKey,
        dominantMood: moodConfig.displayMood,
        emoji: moodConfig.emoji,
        confidence,
        confidenceDisplay: `${Math.round(confidence * 100)}%`,
        hudLabel: moodConfig.hudLabel,
        accentColor: moodConfig.accentColor,
        matchedTags: moodConfig.tags,
        energyRange: moodConfig.energyRange,
        moodLogId: moodLogRecord ? moodLogRecord._id : null,
        count: recommendations.length,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/moods/recommendations (and /api/v1/mood/recommendations)
 * Query param based recommendations: ?mood=happy&energyLevel=8&limit=10
 */
async function getRecommendations(req, res, next) {
  try {
    const { mood, energyLevel, limit = 10 } = req.query;

    if (!mood || !mood.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "mood" is required (e.g. ?mood=happy, ?mood=calm, ?mood=energy)',
      });
    }

    const { detectedMoodKey, moodConfig } = resolveMoodDetails({ mood });
    const limitNum = Math.min(30, Math.max(1, parseInt(limit, 10) || 10));

    const query = {};

    // Match tags
    const tagRegexes = moodConfig.tags.map((tag) => new RegExp(tag, 'i'));
    query.moodTags = { $in: tagRegexes };

    if (energyLevel) {
      query.energyLevel = Number(energyLevel);
    }

    let songs = await Song.find(query)
      .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
      .populate('album', 'title coverImage releaseYear')
      .populate('genres', 'name vibeDescriptor accentColor')
      .sort({ playCount: -1 })
      .limit(limitNum)
      .lean();

    // Fallback: If no exact tag matches, find songs in matching energy range
    if (songs.length === 0) {
      songs = await Song.find({
        energyLevel: {
          $gte: moodConfig.energyRange[0],
          $lte: moodConfig.energyRange[1],
        },
      })
        .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
        .populate('album', 'title coverImage releaseYear')
        .populate('genres', 'name vibeDescriptor accentColor')
        .sort({ playCount: -1 })
        .limit(limitNum)
        .lean();
    }

    res.status(200).json({
      success: true,
      mood: detectedMoodKey,
      dominantMood: moodConfig.displayMood,
      emoji: moodConfig.emoji,
      hudLabel: moodConfig.hudLabel,
      accentColor: moodConfig.accentColor,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/moods/history (and /api/v1/mood/history)
 * Past biometric emotion scan logs for active user
 */
async function getMoodHistory(req, res, next) {
  try {
    const { limit = 20 } = req.query;
    const query = {};

    if (req.userId) {
      query.user = req.userId;
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    const history = await MoodLog.find(query)
      .populate('recommendedSongs', 'title artistNames coverImage duration audioUrl')
      .populate('selectedSong', 'title artistNames coverImage duration audioUrl')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/moods/vibe/:tag (and /api/v1/mood/vibe/:tag)
 * Get tracks matching specific vibe / emotion tag
 */
async function getTracksByVibe(req, res, next) {
  try {
    const { tag } = req.params;
    const { limit = 20 } = req.query;

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vibe tag is required',
      });
    }

    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const regex = new RegExp(`^${tag.trim()}$`, 'i');

    const songs = await Song.find({ moodTags: regex })
      .populate('primaryArtist', 'name avatar monthlyListenersDisplay isVerified')
      .populate('album', 'title coverImage releaseYear')
      .populate('genres', 'name vibeDescriptor accentColor')
      .sort({ playCount: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      vibe: tag,
      count: songs.length,
      data: songs,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  detectMood,
  getRecommendations,
  getMoodHistory,
  getTracksByVibe,
};
