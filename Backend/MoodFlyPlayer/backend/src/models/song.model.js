const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
      index: true,
    },
    primaryArtist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Primary artist is required'],
    },
    featuredArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],
    // Display string for quick frontend rendering without populating (e.g. "Arijit Singh, Pritam")
    artistNames: {
      type: String,
      required: [true, 'Artist names display string is required'],
      trim: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
    albumTitle: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: Number, // Duration in seconds (e.g. 268 for 4:28)
      required: [true, 'Song duration is required'],
    },
    durationFormatted: {
      type: String, // e.g. "4:28"
      default: '',
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio file URL is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Song cover artwork URL is required'],
    },
    lyrics: {
      type: String,
      default: '',
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    // Biometric & Emotion classification tags
    moodTags: [
      {
        type: String,
        trim: true,
        index: true,
        // e.g. 'Euphoric', 'Calm', 'Vibrant', 'Energetic', 'Lo-Fi', 'Melancholic', 'Relaxed', 'Focus', 'Happy', 'Sad'
      },
    ],
    energyLevel: {
      type: Number, // 1 (mellow/lofi) to 10 (high octane EDM/party)
      min: 1,
      max: 10,
      default: 5,
    },
    playCount: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredSubtitle: {
      type: String, // e.g. "Spiritual Resonance • 2024"
      default: '',
    },
    trendingRank: {
      type: Number,
      default: null,
    },
    trendingBadge: {
      type: String, // e.g. "Trending #1 Today"
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for auto-calculating formatted duration if not explicitly passed
songSchema.pre('save', function () {
  if (this.duration && !this.durationFormatted) {
    const minutes = Math.floor(this.duration / 60);
    const seconds = Math.floor(this.duration % 60);
    this.durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
});

const songModel = mongoose.model('Song', songSchema);

module.exports = songModel;
