const mongoose = require('mongoose');

const recentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: [true, 'Song reference is required'],
    },
    playedDuration: {
      type: Number, // Seconds listened
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    contextMood: {
      type: String, // Mood tag active when song was played
      default: '',
    },
    playedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch recent songs for a user
recentSchema.index({ user: 1, playedAt: -1 });

const recentModel = mongoose.model('Recent', recentSchema);

module.exports = recentModel;
