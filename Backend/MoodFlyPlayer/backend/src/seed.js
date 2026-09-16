const mongoose = require('mongoose');
const connectDB = require('./config/db');
const {
  Genre,
  Artist,
  Album,
  Song,
  Playlist,
  User,
  MoodLog,
  Recent,
  Favorite,
} = require('./models');

// Reliable direct audio sample URLs for streaming testing
const SAMPLE_AUDIOS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
];

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to database for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing catalog data...');
    await Promise.all([
      Genre.deleteMany({}),
      Artist.deleteMany({}),
      Album.deleteMany({}),
      Song.deleteMany({}),
      Playlist.deleteMany({}),
      MoodLog.deleteMany({}),
      Recent.deleteMany({}),
      Favorite.deleteMany({}),
      User.deleteMany({ email: { $in: ['editorial@moodfly.io', 'demo@moodfly.io'] } }),
    ]);
    console.log('✨ Previous collections cleared successfully.');

    // 1. Create Editorial / Curator Users
    console.log('👤 Creating System Users...');
    const editorialUser = await User.create({
      name: 'MoodFly Editorial',
      email: 'editorial@moodfly.io',
      password: 'password123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      preferences: {
        preferredMoods: ['Euphoric', 'Calm', 'Focus', 'Energy', 'Sorrow'],
        webcamMoodDetectionEnabled: true,
      },
    });

    const demoUser = await User.create({
      name: 'Alex Vance',
      email: 'demo@moodfly.io',
      password: 'password123',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      preferences: {
        preferredMoods: ['Calm', 'Lo-Fi', 'Joy'],
        webcamMoodDetectionEnabled: true,
      },
    });

    // 2. Create Genres
    console.log('🎶 Creating Genres (Hip Hop, Ambient, Lo-Fi, Bollywood, Acoustic, EDM)...');
    const genreData = [
      {
        name: 'Hip Hop',
        vibeDescriptor: 'Rhythm & Poetry',
        accentColor: '#f59e0b', // Amber
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
      {
        name: 'Ambient',
        vibeDescriptor: 'Atmosphere & Deep Space',
        accentColor: '#3b82f6', // Blue
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
      {
        name: 'Lo-Fi',
        vibeDescriptor: 'Chill Beats & Relaxed Study',
        accentColor: '#8b5cf6', // Violet
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
      {
        name: 'Bollywood',
        vibeDescriptor: 'Soulful Melody & Cinematic Emotion',
        accentColor: '#ec4899', // Pink
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
      {
        name: 'Acoustic',
        vibeDescriptor: 'Organic Warmth & Pure Strings',
        accentColor: '#10b981', // Emerald
        coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
      {
        name: 'EDM',
        vibeDescriptor: 'Electric Energy & Festival Bass',
        accentColor: '#ef4444', // Red
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        isPopular: true,
      },
    ];

    const genres = await Genre.insertMany(genreData);
    const genreMap = {};
    genres.forEach((g) => {
      genreMap[g.name] = g;
    });

    // 3. Create Artists
    console.log('🎤 Creating Artists with Profiles & Stats...');
    const artistData = [
      {
        name: 'DIVINE',
        bio: 'Gully Gang pioneer delivering raw lyrical narratives straight from the streets of Mumbai.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 8450000,
        monthlyListenersDisplay: '8.4M Monthly',
        isVerified: true,
        genres: [genreMap['Hip Hop']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/divine',
          instagram: 'https://instagram.com/vivianakadivine',
          youtube: 'https://youtube.com/c/divine',
        },
      },
      {
        name: 'Solar Fields',
        bio: 'Atmospheric ambient visionary blending cinematic drone sweeps and downtempo psychoacoustics.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 1950000,
        monthlyListenersDisplay: '1.9M Monthly',
        isVerified: true,
        genres: [genreMap['Ambient']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/solarfields',
          instagram: 'https://instagram.com/solarfields',
        },
      },
      {
        name: 'Komorebi Sound',
        bio: 'Analog tape-saturated lo-fi chillhop creator crafting nocturnal study sounds for restless wanderers.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 4200000,
        monthlyListenersDisplay: '4.2M Monthly',
        isVerified: true,
        genres: [genreMap['Lo-Fi']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/komorebi',
          youtube: 'https://youtube.com/c/komorebi',
        },
      },
      {
        name: 'Arijit Singh',
        bio: 'The voice of modern Indian cinema, known for heartfelt romantic ballads and poignant melancholia.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 42300000,
        monthlyListenersDisplay: '42.3M Monthly',
        isVerified: true,
        genres: [genreMap['Bollywood']._id, genreMap['Acoustic']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/arijitsingh',
          instagram: 'https://instagram.com/arijitsingh',
        },
      },
      {
        name: 'Prateek Kuhad',
        bio: 'Indie-folk singer-songwriter crafting intimate acoustic stories that resonate across heartbreak and longing.',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 3600000,
        monthlyListenersDisplay: '3.6M Monthly',
        isVerified: true,
        genres: [genreMap['Acoustic']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/prateekkuhad',
          instagram: 'https://instagram.com/prateekkuhad',
        },
      },
      {
        name: 'KSHMR',
        bio: 'World-renowned electro house producer merging thunderous festival drops with cinematic orchestral world textures.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        monthlyListeners: 14800000,
        monthlyListenersDisplay: '14.8M Monthly',
        isVerified: true,
        genres: [genreMap['EDM']._id],
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/kshmr',
          instagram: 'https://instagram.com/kshmr',
          twitter: 'https://twitter.com/KSHMRmusic',
        },
      },
    ];

    const artists = await Artist.insertMany(artistData);
    const artistMap = {};
    artists.forEach((a) => {
      artistMap[a.name] = a;
    });

    // 4. Create Albums
    console.log('💿 Creating Albums...');
    const albumData = [
      {
        title: 'Punya Paap',
        artist: artistMap['DIVINE']._id,
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2020,
        genre: genreMap['Hip Hop']._id,
        totalTracks: 2,
      },
      {
        title: 'Movements in Space',
        artist: artistMap['Solar Fields']._id,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2022,
        genre: genreMap['Ambient']._id,
        totalTracks: 2,
      },
      {
        title: 'Tokyo Rain Notes',
        artist: artistMap['Komorebi Sound']._id,
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2023,
        genre: genreMap['Lo-Fi']._id,
        totalTracks: 2,
      },
      {
        title: 'Shayad & Memories',
        artist: artistMap['Arijit Singh']._id,
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2021,
        genre: genreMap['Bollywood']._id,
        totalTracks: 2,
      },
      {
        title: 'Cold / Mess Unplugged',
        artist: artistMap['Prateek Kuhad']._id,
        coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2022,
        genre: genreMap['Acoustic']._id,
        totalTracks: 2,
      },
      {
        title: 'Harmonica Andromeda',
        artist: artistMap['KSHMR']._id,
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        releaseYear: 2023,
        genre: genreMap['EDM']._id,
        totalTracks: 2,
      },
    ];

    const albums = await Album.insertMany(albumData);
    const albumMap = {};
    albums.forEach((alb) => {
      albumMap[alb.title] = alb;
    });

    // 5. Create Songs with Mood Tags, Durations, Artwork & Audio URLs
    console.log('🎵 Creating Songs with Mood Tags, Energy Levels & Audio URLs...');
    const songData = [
      // Hip Hop Tracks (Energy / High Vibe)
      {
        title: 'Mirchi Gully Anthem',
        primaryArtist: artistMap['DIVINE']._id,
        artistNames: 'DIVINE',
        album: albumMap['Punya Paap']._id,
        albumTitle: 'Punya Paap',
        duration: 215,
        durationFormatted: '3:35',
        audioUrl: SAMPLE_AUDIOS[0],
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Gully gang boy, chal Bombay se seedha global flow...',
        genres: [genreMap['Hip Hop']._id],
        moodTags: ['Energy', 'Joy', 'Vibrant', 'Euphoric'],
        energyLevel: 9,
        playCount: 154200,
        isFeatured: true,
        featuredSubtitle: 'Gully Heavyweight • Top 50 India',
        trendingRank: 1,
        trendingBadge: 'Trending #1 in Hip Hop',
      },
      {
        title: '3:59 AM Hustle',
        primaryArtist: artistMap['DIVINE']._id,
        artistNames: 'DIVINE',
        album: albumMap['Punya Paap']._id,
        albumTitle: 'Punya Paap',
        duration: 248,
        durationFormatted: '4:08',
        audioUrl: SAMPLE_AUDIOS[1],
        coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Bhookh nahi miti ab tak, sapne hain aasmaan se unche...',
        genres: [genreMap['Hip Hop']._id],
        moodTags: ['Energy', 'Focus'],
        energyLevel: 8,
        playCount: 98400,
        isFeatured: false,
      },

      // Ambient Tracks (Calm / Focus / Atmospheric)
      {
        title: 'Starlight Drift Echoes',
        primaryArtist: artistMap['Solar Fields']._id,
        artistNames: 'Solar Fields',
        album: albumMap['Movements in Space']._id,
        albumTitle: 'Movements in Space',
        duration: 372,
        durationFormatted: '6:12',
        audioUrl: SAMPLE_AUDIOS[2],
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        lyrics: '[Instrumental Ambient Soundscape]',
        genres: [genreMap['Ambient']._id],
        moodTags: ['Calm', 'Relaxed', 'Focus'],
        energyLevel: 2,
        playCount: 78900,
        isFeatured: true,
        featuredSubtitle: 'Deep Meditation • Biometric Resonance',
        trendingRank: 4,
        trendingBadge: 'Editor Choice - Deep Calm',
      },
      {
        title: 'Solitude Over Nebula',
        primaryArtist: artistMap['Solar Fields']._id,
        artistNames: 'Solar Fields',
        album: albumMap['Movements in Space']._id,
        albumTitle: 'Movements in Space',
        duration: 310,
        durationFormatted: '5:10',
        audioUrl: SAMPLE_AUDIOS[3],
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
        lyrics: '[Instrumental Ambient Soundscape]',
        genres: [genreMap['Ambient']._id],
        moodTags: ['Calm', 'Sorrow', 'Melancholic'],
        energyLevel: 3,
        playCount: 43200,
        isFeatured: false,
      },

      // Lo-Fi Tracks (Calm / Focus / Lo-Fi)
      {
        title: 'Coffee Steam at Midnight',
        primaryArtist: artistMap['Komorebi Sound']._id,
        artistNames: 'Komorebi Sound',
        album: albumMap['Tokyo Rain Notes']._id,
        albumTitle: 'Tokyo Rain Notes',
        duration: 165,
        durationFormatted: '2:45',
        audioUrl: SAMPLE_AUDIOS[4],
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        lyrics: '[Lo-Fi Beat & Soft Vinyl Crackle]',
        genres: [genreMap['Lo-Fi']._id],
        moodTags: ['Calm', 'Lo-Fi', 'Focus', 'Relaxed'],
        energyLevel: 3,
        playCount: 210500,
        isFeatured: true,
        featuredSubtitle: 'Coding & Focus Essentials',
        trendingRank: 2,
        trendingBadge: 'Top Lo-Fi Stream',
      },
      {
        title: 'Rain Window Reverie',
        primaryArtist: artistMap['Komorebi Sound']._id,
        artistNames: 'Komorebi Sound',
        album: albumMap['Tokyo Rain Notes']._id,
        albumTitle: 'Tokyo Rain Notes',
        duration: 182,
        durationFormatted: '3:02',
        audioUrl: SAMPLE_AUDIOS[5],
        coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
        lyrics: '[Lo-Fi Downtempo Piano]',
        genres: [genreMap['Lo-Fi']._id],
        moodTags: ['Calm', 'Melancholic', 'Sorrow'],
        energyLevel: 2,
        playCount: 89400,
        isFeatured: false,
      },

      // Bollywood Tracks (Sorrow / Melancholy & Joy)
      {
        title: 'Bikhre Khwaab (Shattered Dreams)',
        primaryArtist: artistMap['Arijit Singh']._id,
        artistNames: 'Arijit Singh',
        album: albumMap['Shayad & Memories']._id,
        albumTitle: 'Shayad & Memories',
        duration: 278,
        durationFormatted: '4:38',
        audioUrl: SAMPLE_AUDIOS[6],
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Kyun haath se chhoota safar, kyun aashiyana jal gaya...',
        genres: [genreMap['Bollywood']._id],
        moodTags: ['Sorrow', 'Melancholic', 'Calm'],
        energyLevel: 4,
        playCount: 450900,
        isFeatured: true,
        featuredSubtitle: 'Heartbreak & Soulful Reflections',
        trendingRank: 3,
        trendingBadge: 'Top Emotional Track',
      },
      {
        title: 'Rangon Ka Milan (Festive Joy)',
        primaryArtist: artistMap['Arijit Singh']._id,
        artistNames: 'Arijit Singh',
        album: albumMap['Shayad & Memories']._id,
        albumTitle: 'Shayad & Memories',
        duration: 224,
        durationFormatted: '3:44',
        audioUrl: SAMPLE_AUDIOS[7],
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Tere sang muskuraaye ye dil mera, khushiyon ki bahaar...',
        genres: [genreMap['Bollywood']._id],
        moodTags: ['Joy', 'Happy', 'Euphoric'],
        energyLevel: 7,
        playCount: 320100,
        isFeatured: false,
      },

      // Acoustic Tracks (Calm / Organic / Joy & Melancholy)
      {
        title: 'Whispers Under the Oak',
        primaryArtist: artistMap['Prateek Kuhad']._id,
        artistNames: 'Prateek Kuhad',
        album: albumMap['Cold / Mess Unplugged']._id,
        albumTitle: 'Cold / Mess Unplugged',
        duration: 201,
        durationFormatted: '3:21',
        audioUrl: SAMPLE_AUDIOS[0],
        coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
        lyrics: 'When the night turns cold, will you hold on to me tight...',
        genres: [genreMap['Acoustic']._id],
        moodTags: ['Calm', 'Sorrow', 'Melancholic', 'Relaxed'],
        energyLevel: 3,
        playCount: 182300,
        isFeatured: true,
        featuredSubtitle: 'Intimate Candlelit Acoustic Sessions',
      },
      {
        title: 'Morning Sunbeams',
        primaryArtist: artistMap['Prateek Kuhad']._id,
        artistNames: 'Prateek Kuhad',
        album: albumMap['Cold / Mess Unplugged']._id,
        albumTitle: 'Cold / Mess Unplugged',
        duration: 194,
        durationFormatted: '3:14',
        audioUrl: SAMPLE_AUDIOS[1],
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Wake up to the golden light, everything feels new again...',
        genres: [genreMap['Acoustic']._id],
        moodTags: ['Joy', 'Happy', 'Calm'],
        energyLevel: 5,
        playCount: 95400,
        isFeatured: false,
      },

      // EDM Tracks (Energy / Euphoric / Vibrant)
      {
        title: 'Supernova Festival Anthem',
        primaryArtist: artistMap['KSHMR']._id,
        artistNames: 'KSHMR',
        album: albumMap['Harmonica Andromeda']._id,
        albumTitle: 'Harmonica Andromeda',
        duration: 236,
        durationFormatted: '3:56',
        audioUrl: SAMPLE_AUDIOS[2],
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Turn the bass up, let the lights ignite your soul!',
        genres: [genreMap['EDM']._id],
        moodTags: ['Energy', 'Euphoric', 'Joy', 'Vibrant'],
        energyLevel: 10,
        playCount: 610000,
        isFeatured: true,
        featuredSubtitle: 'Festival Mainstage • Ultra Energy',
        trendingRank: 5,
        trendingBadge: 'Trending #1 in Dance',
      },
      {
        title: 'Midnight Mirage Dropped',
        primaryArtist: artistMap['KSHMR']._id,
        artistNames: 'KSHMR',
        album: albumMap['Harmonica Andromeda']._id,
        albumTitle: 'Harmonica Andromeda',
        duration: 218,
        durationFormatted: '3:38',
        audioUrl: SAMPLE_AUDIOS[3],
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        lyrics: 'Lost in the rhythm of the neon lights...',
        genres: [genreMap['EDM']._id],
        moodTags: ['Energy', 'Euphoric'],
        energyLevel: 9,
        playCount: 245000,
        isFeatured: false,
      },
    ];

    const songs = await Song.insertMany(songData);
    const songMap = {};
    songs.forEach((s) => {
      songMap[s.title] = s;
    });

    // 6. Update Albums with their corresponding Song IDs
    console.log('🔄 Linking songs to respective albums...');
    for (const album of albums) {
      const albumSongs = songs.filter(
        (s) => s.album && s.album.toString() === album._id.toString()
      );
      album.songs = albumSongs.map((s) => s._id);
      album.totalTracks = albumSongs.length;
      await album.save();
    }

    // 7. Create Sample Curated Playlists based on moods and genres
    console.log('📑 Creating Curated Playlists for MoodFly...');
    const playlistsData = [
      {
        name: 'High Energy Blast & Workout',
        description: 'High-octane drops and hard-hitting rhythms to fuel peak performance and workouts.',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        user: editorialUser._id,
        isPublic: true,
        moodSyncDynamic: true,
        sidebarIcon: 'bolt',
        accentColor: '#ef4444',
        targetMood: 'Energy',
        songs: [
          { song: songMap['Supernova Festival Anthem']._id, addedAt: new Date() },
          { song: songMap['Mirchi Gully Anthem']._id, addedAt: new Date() },
          { song: songMap['Midnight Mirage Dropped']._id, addedAt: new Date() },
          { song: songMap['3:59 AM Hustle']._id, addedAt: new Date() },
        ],
      },
      {
        name: 'Midnight Study & Lo-Fi Chill',
        description: 'Subtle beats, nostalgic analog crackle, and soft melodies for deep work and late nights.',
        coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        user: editorialUser._id,
        isPublic: true,
        moodSyncDynamic: true,
        sidebarIcon: 'nightlight',
        accentColor: '#8b5cf6',
        targetMood: 'Lo-Fi',
        songs: [
          { song: songMap['Coffee Steam at Midnight']._id, addedAt: new Date() },
          { song: songMap['Rain Window Reverie']._id, addedAt: new Date() },
          { song: songMap['Starlight Drift Echoes']._id, addedAt: new Date() },
        ],
      },
      {
        name: 'Pure Calm & Ambient Zen',
        description: 'Drift away with expansive cosmic synthesizers and gentle acoustic textures designed for peace.',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        user: editorialUser._id,
        isPublic: true,
        moodSyncDynamic: true,
        sidebarIcon: 'self_improvement',
        accentColor: '#3b82f6',
        targetMood: 'Calm',
        songs: [
          { song: songMap['Starlight Drift Echoes']._id, addedAt: new Date() },
          { song: songMap['Whispers Under the Oak']._id, addedAt: new Date() },
          { song: songMap['Solitude Over Nebula']._id, addedAt: new Date() },
        ],
      },
      {
        name: 'Heartache & Healing (Sorrow)',
        description: 'Vulnerable acoustic strings and emotional vocal performances for tender moments and sorrow.',
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        user: editorialUser._id,
        isPublic: true,
        moodSyncDynamic: false,
        sidebarIcon: 'water_drop',
        accentColor: '#6b7280',
        targetMood: 'Sorrow',
        songs: [
          { song: songMap['Bikhre Khwaab (Shattered Dreams)']._id, addedAt: new Date() },
          { song: songMap['Whispers Under the Oak']._id, addedAt: new Date() },
          { song: songMap['Solitude Over Nebula']._id, addedAt: new Date() },
        ],
      },
      {
        name: 'Pure Joy & Sunny Vibes',
        description: 'Bright melodies, uplifting acoustic rhythms, and euphoric celebration tracks.',
        coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        user: editorialUser._id,
        isPublic: true,
        moodSyncDynamic: true,
        sidebarIcon: 'wb_sunny',
        accentColor: '#10b981',
        targetMood: 'Joy',
        songs: [
          { song: songMap['Rangon Ka Milan (Festive Joy)']._id, addedAt: new Date() },
          { song: songMap['Morning Sunbeams']._id, addedAt: new Date() },
          { song: songMap['Supernova Festival Anthem']._id, addedAt: new Date() },
          { song: songMap['Mirchi Gully Anthem']._id, addedAt: new Date() },
        ],
      },
    ];

    const playlists = await Playlist.insertMany(playlistsData);

    // 8. Add sample favorites, recent listens & mood scans for demoUser
    console.log('⭐ Setting up initial user favorites, recent listens & mood logs...');
    await Favorite.create({
      user: demoUser._id,
      song: songMap['Mirchi Gully Anthem']._id,
    });
    await Favorite.create({
      user: demoUser._id,
      song: songMap['Coffee Steam at Midnight']._id,
    });

    await Recent.create({
      user: demoUser._id,
      song: songMap['Coffee Steam at Midnight']._id,
      playedDuration: 165,
      completed: true,
      contextMood: 'Calm',
      playedAt: new Date(Date.now() - 1000 * 60 * 15),
    });
    await Recent.create({
      user: demoUser._id,
      song: songMap['Mirchi Gully Anthem']._id,
      playedDuration: 140,
      completed: false,
      contextMood: 'Energy',
      playedAt: new Date(Date.now() - 1000 * 60 * 45),
    });

    await MoodLog.create({
      user: demoUser._id,
      mood: 'happy',
      emoji: '😊',
      confidence: 0.94,
      recommendedSongs: [
        songMap['Rangon Ka Milan (Festive Joy)']._id,
        songMap['Morning Sunbeams']._id,
        songMap['Supernova Festival Anthem']._id,
      ],
      selectedSong: songMap['Rangon Ka Milan (Festive Joy)']._id,
      detectionSource: 'webcam_scan',
    });
    await MoodLog.create({
      user: demoUser._id,
      mood: 'calm',
      emoji: '😌',
      confidence: 0.88,
      recommendedSongs: [
        songMap['Coffee Steam at Midnight']._id,
        songMap['Starlight Drift Echoes']._id,
      ],
      selectedSong: songMap['Coffee Steam at Midnight']._id,
      detectionSource: 'webcam_scan',
    });

    // 9. Summary output
    console.log('\n=============================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log(`👤 Users created:     2 (editorial@moodfly.io, demo@moodfly.io)`);
    console.log(`🎶 Genres created:    ${genres.length} (Hip Hop, Ambient, Lo-Fi, Bollywood, Acoustic, EDM)`);
    console.log(`🎤 Artists created:   ${artists.length}`);
    console.log(`💿 Albums created:    ${albums.length}`);
    console.log(`🎵 Songs created:     ${songs.length}`);
    console.log(`📑 Playlists created: ${playlists.length}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
}

// Execute seeding script
seedDatabase();
