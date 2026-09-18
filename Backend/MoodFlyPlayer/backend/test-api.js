const BASE_URL = 'http://localhost:5000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function logPass(title, details = '') {
  console.log(`${colors.green}✔ PASS${colors.reset} [${title}] ${details}`);
}

function logFail(title, error) {
  console.log(`${colors.red}✖ FAIL${colors.reset} [${title}] ${error}`);
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, ok: response.ok, data };
}

async function runTests() {
  console.log(`${colors.bold}${colors.cyan}==========================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  MOODFLY API AUTOMATED TEST SUITE        ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}==========================================${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  // State to pass between tests
  let sampleSongId = null;
  let sampleGenreId = null;
  let sampleArtistId = null;
  let sampleAlbumId = null;
  let createdPlaylistId = null;

  async function test(name, fn) {
    try {
      await fn();
      passed++;
    } catch (err) {
      logFail(name, err.message || err);
      failed++;
    }
  }

  // 1. Root & Health
  await test('GET / - Root endpoint', async () => {
    const res = await request('/');
    if (res.status === 200 && res.data.status === 'online') {
      logPass('GET /', `Message: "${res.data.message}"`);
    } else {
      throw new Error(`Unexpected status ${res.status}`);
    }
  });

  await test('GET /health - Health check', async () => {
    const res = await request('/health');
    if (res.status === 200 && res.data.database?.status === 'connected') {
      logPass('GET /health', `DB: ${res.data.database.name} (${res.data.database.status})`);
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(res.data)}`);
    }
  });

  // 2. Songs Endpoints
  await test('GET /api/v1/songs - Get all songs (filter & pagination)', async () => {
    const res = await request('/api/v1/songs?page=1&limit=5');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      if (res.data.data.length > 0) {
        sampleSongId = res.data.data[0]._id;
        logPass('GET /api/v1/songs', `Found ${res.data.total} total songs. Sample: "${res.data.data[0].title}" (_id: ${sampleSongId})`);
      } else {
        logPass('GET /api/v1/songs', 'Returned 0 songs (empty collection)');
      }
    } else {
      throw new Error(`Failed to list songs: ${JSON.stringify(res.data)}`);
    }
  });

  await test('GET /api/v1/songs/featured - Featured & Hero song', async () => {
    const res = await request('/api/v1/songs/featured');
    if (res.status === 200 && res.data.success) {
      logPass('GET /api/v1/songs/featured', `Hero Track: ${res.data.hero?.title || 'None'}`);
    } else {
      throw new Error(`Failed featured songs: ${JSON.stringify(res.data)}`);
    }
  });

  if (sampleSongId) {
    await test(`GET /api/v1/songs/:id - Song stream details`, async () => {
      const res = await request(`/api/v1/songs/${sampleSongId}`);
      if (res.status === 200 && res.data.data?._id === sampleSongId) {
        logPass(`GET /api/v1/songs/${sampleSongId}`, `Title: ${res.data.data.title}, Audio: ${res.data.data.audioUrl?.substring(0, 45)}...`);
      } else {
        throw new Error(`Failed single song lookup: ${JSON.stringify(res.data)}`);
      }
    });
  }

  // 3. Genres Endpoints
  await test('GET /api/v1/genres - List vibe-based genres', async () => {
    const res = await request('/api/v1/genres');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      if (res.data.data.length > 0) {
        sampleGenreId = res.data.data[0]._id;
        logPass('GET /api/v1/genres', `Returned ${res.data.count} genres. First: ${res.data.data[0].name}`);
      } else {
        logPass('GET /api/v1/genres', 'Returned 0 genres');
      }
    } else {
      throw new Error(`Failed genres: ${JSON.stringify(res.data)}`);
    }
  });

  if (sampleGenreId) {
    await test('GET /api/v1/genres/:id - Single genre & songs', async () => {
      const res = await request(`/api/v1/genres/${sampleGenreId}`);
      if (res.status === 200 && res.data.success) {
        logPass(`GET /api/v1/genres/${sampleGenreId}`, `Genre: ${res.data.data.name}, Songs in genre: ${res.data.data.songCount}`);
      } else {
        throw new Error(`Failed genre details: ${JSON.stringify(res.data)}`);
      }
    });
  }

  // 4. Artists Endpoints
  await test('GET /api/v1/artists - List artists', async () => {
    const res = await request('/api/v1/artists');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      if (res.data.data.length > 0) {
        sampleArtistId = res.data.data[0]._id;
        logPass('GET /api/v1/artists', `Found ${res.data.count} artists. First: ${res.data.data[0].name}`);
      } else {
        logPass('GET /api/v1/artists', 'Returned 0 artists');
      }
    } else {
      throw new Error(`Failed artists: ${JSON.stringify(res.data)}`);
    }
  });

  if (sampleArtistId) {
    await test('GET /api/v1/artists/:id - Artist profile & top songs', async () => {
      const res = await request(`/api/v1/artists/${sampleArtistId}`);
      if (res.status === 200 && res.data.success) {
        logPass(`GET /api/v1/artists/${sampleArtistId}`, `Artist: ${res.data.data.name}, Top songs: ${res.data.data.topSongs?.length || 0}`);
      } else {
        throw new Error(`Failed artist profile: ${JSON.stringify(res.data)}`);
      }
    });
  }

  // 5. Albums Endpoints
  await test('GET /api/v1/albums - List albums', async () => {
    const res = await request('/api/v1/albums');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      if (res.data.data.length > 0) {
        sampleAlbumId = res.data.data[0]._id;
        logPass('GET /api/v1/albums', `Found ${res.data.count} albums. First: "${res.data.data[0].title}"`);
      } else {
        logPass('GET /api/v1/albums', 'Returned 0 albums');
      }
    } else {
      throw new Error(`Failed albums: ${JSON.stringify(res.data)}`);
    }
  });

  if (sampleAlbumId) {
    await test('GET /api/v1/albums/:id - Single album & tracklist', async () => {
      const res = await request(`/api/v1/albums/${sampleAlbumId}`);
      if (res.status === 200 && res.data.success) {
        logPass(`GET /api/v1/albums/${sampleAlbumId}`, `Album: "${res.data.data.title}", Tracks: ${res.data.data.songs?.length || 0}`);
      } else {
        throw new Error(`Failed album details: ${JSON.stringify(res.data)}`);
      }
    });
  }

  // 6. Mood Endpoints
  await test('POST /api/v1/moods/detect - Biometric emotion detection (mood string)', async () => {
    const res = await request('/api/v1/moods/detect', {
      method: 'POST',
      body: JSON.stringify({
        mood: 'happy',
        confidence: 0.94,
        limit: 5,
        detectionSource: 'automated_test',
      }),
    });
    if (res.status === 200 && res.data.success) {
      logPass('POST /api/v1/moods/detect', `Detected: ${res.data.data.detectedMood} (${res.data.data.emoji}), Curated Tracks: ${res.data.data.count}`);
    } else {
      throw new Error(`Failed detectMood: ${JSON.stringify(res.data)}`);
    }
  });

  await test('POST /api/v1/moods/detect - Biometric emotion detection (facial expressions matrix)', async () => {
    const res = await request('/api/v1/moods/detect', {
      method: 'POST',
      body: JSON.stringify({
        expressions: {
          happy: 0.1,
          neutral: 0.85,
          sad: 0.05,
        },
        limit: 5,
      }),
    });
    if (res.status === 200 && res.data.success) {
      logPass('POST /api/v1/moods/detect (matrix)', `Resolved Mood: ${res.data.data.detectedMood} (${res.data.data.dominantMood})`);
    } else {
      throw new Error(`Failed expressions detectMood: ${JSON.stringify(res.data)}`);
    }
  });

  await test('GET /api/v1/moods/recommendations - Recommendations by mood param', async () => {
    const res = await request('/api/v1/moods/recommendations?mood=calm&energyLevel=3&limit=5');
    if (res.status === 200 && res.data.success) {
      logPass('GET /api/v1/moods/recommendations', `Mood: ${res.data.mood}, Tracks returned: ${res.data.count}`);
    } else {
      throw new Error(`Failed recommendations: ${JSON.stringify(res.data)}`);
    }
  });

  await test('GET /api/v1/moods/history - User biometric scan history', async () => {
    const res = await request('/api/v1/moods/history?limit=5');
    if (res.status === 200 && res.data.success) {
      logPass('GET /api/v1/moods/history', `History logs found: ${res.data.count}`);
    } else {
      throw new Error(`Failed history: ${JSON.stringify(res.data)}`);
    }
  });

  await test('GET /api/v1/moods/vibe/:tag - Tracks by vibe tag', async () => {
    const res = await request('/api/v1/moods/vibe/Euphoric?limit=5');
    if (res.status === 200 && res.data.success) {
      logPass('GET /api/v1/moods/vibe/Euphoric', `Found ${res.data.count} tracks with vibe "Euphoric"`);
    } else {
      throw new Error(`Failed vibe tag: ${JSON.stringify(res.data)}`);
    }
  });

  // 7. Playlists Endpoints (Full CRUD)
  await test('GET /api/v1/playlists - List playlists', async () => {
    const res = await request('/api/v1/playlists');
    if (res.status === 200 && res.data.success) {
      logPass('GET /api/v1/playlists', `Found ${res.data.count} playlists`);
    } else {
      throw new Error(`Failed playlists list: ${JSON.stringify(res.data)}`);
    }
  });

  await test('POST /api/v1/playlists - Create new playlist', async () => {
    const res = await request('/api/v1/playlists', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Automated Test Chill Beats',
        description: 'Created during test suite verification',
        accentColor: '#10b981',
        moodSyncDynamic: true,
        targetMood: 'Calm',
        songs: sampleSongId ? [sampleSongId] : [],
      }),
    });
    if (res.status === 201 && res.data.success && res.data.data?._id) {
      createdPlaylistId = res.data.data._id;
      logPass('POST /api/v1/playlists', `Created Playlist ID: ${createdPlaylistId} ("${res.data.data.name}")`);
    } else {
      throw new Error(`Failed create playlist: ${JSON.stringify(res.data)}`);
    }
  });

  if (createdPlaylistId) {
    await test(`GET /api/v1/playlists/:id - Fetch created playlist`, async () => {
      const res = await request(`/api/v1/playlists/${createdPlaylistId}`);
      if (res.status === 200 && res.data.success) {
        logPass(`GET /api/v1/playlists/${createdPlaylistId}`, `Name: "${res.data.data.name}", Songs: ${res.data.data.totalSongs}`);
      } else {
        throw new Error(`Failed get playlist: ${JSON.stringify(res.data)}`);
      }
    });

    await test(`PATCH /api/v1/playlists/:id - Update playlist`, async () => {
      const res = await request(`/api/v1/playlists/${createdPlaylistId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: 'Automated Test Chill Beats [UPDATED]',
          accentColor: '#06b6d4',
        }),
      });
      if (res.status === 200 && res.data.success && res.data.data.name.includes('[UPDATED]')) {
        logPass(`PATCH /api/v1/playlists/${createdPlaylistId}`, `Updated name: "${res.data.data.name}"`);
      } else {
        throw new Error(`Failed update playlist: ${JSON.stringify(res.data)}`);
      }
    });

    if (sampleSongId) {
      await test(`POST /api/v1/playlists/:id/songs - Add song to playlist`, async () => {
        const res = await request(`/api/v1/playlists/${createdPlaylistId}/songs`, {
          method: 'POST',
          body: JSON.stringify({ songId: sampleSongId }),
        });
        if (res.status === 200 && res.data.success) {
          logPass(`POST /api/v1/playlists/${createdPlaylistId}/songs`, res.data.message);
        } else {
          throw new Error(`Failed add song to playlist: ${JSON.stringify(res.data)}`);
        }
      });

      await test(`DELETE /api/v1/playlists/:id/songs/:songId - Remove song from playlist`, async () => {
        const res = await request(`/api/v1/playlists/${createdPlaylistId}/songs/${sampleSongId}`, {
          method: 'DELETE',
        });
        if (res.status === 200 && res.data.success) {
          logPass(`DELETE /api/v1/playlists/.../songs/${sampleSongId}`, res.data.message);
        } else {
          throw new Error(`Failed remove song from playlist: ${JSON.stringify(res.data)}`);
        }
      });
    }

    await test(`DELETE /api/v1/playlists/:id - Delete test playlist`, async () => {
      const res = await request(`/api/v1/playlists/${createdPlaylistId}`, {
        method: 'DELETE',
      });
      if (res.status === 200 && res.data.success) {
        logPass(`DELETE /api/v1/playlists/${createdPlaylistId}`, res.data.message);
      } else {
        throw new Error(`Failed delete playlist: ${JSON.stringify(res.data)}`);
      }
    });
  }

  // 8. User Library Endpoints (Favorites & Recents)
  if (sampleSongId) {
    await test('POST /api/v1/library/favorites/toggle - Toggle Favorite ON', async () => {
      const res = await request('/api/v1/library/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ songId: sampleSongId }),
      });
      if (res.status === 200 && res.data.success) {
        logPass('POST /api/v1/library/favorites/toggle', `isFavorited: ${res.data.isFavorited} (${res.data.message})`);
      } else {
        throw new Error(`Failed toggle favorite: ${JSON.stringify(res.data)}`);
      }
    });

    await test('GET /api/v1/library/favorites - Get user favorites', async () => {
      const res = await request('/api/v1/library/favorites');
      if (res.status === 200 && res.data.success) {
        logPass('GET /api/v1/library/favorites', `User has ${res.data.count} favorited songs`);
      } else {
        throw new Error(`Failed get favorites: ${JSON.stringify(res.data)}`);
      }
    });

    await test('POST /api/v1/library/recents - Log playback session', async () => {
      const res = await request('/api/v1/library/recents', {
        method: 'POST',
        body: JSON.stringify({
          songId: sampleSongId,
          playedDuration: 120,
          completed: true,
          contextMood: 'Calm',
        }),
      });
      if (res.status === 201 && res.data.success) {
        logPass('POST /api/v1/library/recents', `Logged playback for "${res.data.data.song?.title || sampleSongId}"`);
      } else {
        throw new Error(`Failed log recent: ${JSON.stringify(res.data)}`);
      }
    });

    await test('GET /api/v1/library/recents - Get listening history', async () => {
      const res = await request('/api/v1/library/recents?limit=10');
      if (res.status === 200 && res.data.success) {
        logPass('GET /api/v1/library/recents', `Found ${res.data.count} recent playback records`);
      } else {
        throw new Error(`Failed get recents: ${JSON.stringify(res.data)}`);
      }
    });
  }

  console.log(`\n${colors.bold}${colors.cyan}==========================================${colors.reset}`);
  console.log(`${colors.bold}TEST RESULTS: ${colors.green}${passed} Passed${colors.reset}, ${failed > 0 ? colors.red : colors.reset}${failed} Failed`);
  console.log(`${colors.bold}${colors.cyan}==========================================${colors.reset}\n`);
}

runTests().catch((err) => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
