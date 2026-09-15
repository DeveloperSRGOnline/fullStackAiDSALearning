const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Direct emotion/mood detected (e.g., "happy", "sad", "neutral", "surprised", "angry", etc.)
    mood: {
      type: String,
      required: [true, 'Mood is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    emoji: {
      type: String,
      default: '✨',
    },
    confidence: {
      type: Number, // Optional score from face-api.js (0.0 to 1.0)
      min: 0,
      max: 1,
      default: 1,
    },
    // Top songs curated/recommended by AI for this mood scan
    recommendedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    // The song user actually chose to listen to from the recommendations
    selectedSong: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
    detectionSource: {
      type: String,
      enum: ['webcam_scan', 'manual_selection', 'audio_telemetry'],
      default: 'webcam_scan',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual alias to support detectedMood if passed or queried
moodLogSchema.virtual('detectedMood').get(function () {
  return this.mood;
}).set(function (val) {
  this.mood = val;
});

const moodLogModel = mongoose.model('MoodLog', moodLogSchema);

module.exports = moodLogModel;
