const mongoose = require('mongoose');

const playlistItemSchema = new mongoose.Schema(
  {
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Playlist creator is required'],
      index: true,
    },
    songs: [playlistItemSchema],
    isPublic: {
      type: Boolean,
      default: true, // Toggle in UI: "Public Playlist"
    },
    moodSyncDynamic: {
      type: Boolean,
      default: false, // Toggle in UI: "Mood Sync Dynamic - Auto-sort tracks using webcam emotion scan"
    },
    sidebarIcon: {
      type: String,
      default: 'queue_music', // e.g., 'graphic_eq', 'nightlight', 'bolt'
    },
    accentColor: {
      type: String,
      default: '#10b981',
    },
    targetMood: {
      type: String,
      trim: true,
      default: '', // e.g., "Chill Vibes", "Gym Boost", "Euphoric Focus"
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total song count
playlistSchema.virtual('totalSongs').get(function () {
  return this.songs ? this.songs.length : 0;
});

const playlistModel = mongoose.model('Playlist', playlistSchema);

module.exports = playlistModel;
