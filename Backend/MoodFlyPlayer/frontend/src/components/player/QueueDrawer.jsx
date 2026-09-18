import React from 'react';
import { useAudio } from '../../context/AudioContext';

export const QueueDrawer = () => {
  const {
    queue,
    currentSong,
    isPlaying,
    isQueueOpen,
    setIsQueueOpen,
    playSong,
    formatTime,
  } = useAudio();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 max-h-[480px] bg-surface-dim/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">queue_music</span>
          <h3 className="font-headline font-semibold text-sm text-on-surface">Playback Queue</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono">
            {queue.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsQueueOpen(false)}
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-white/[0.04]"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Queue Song List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-white/[0.03]">
        {queue.map((song, idx) => {
          const isCurrent = currentSong?._id === song._id;
          return (
            <div
              key={song._id || idx}
              onClick={() => playSong(song, queue)}
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group ${
                isCurrent
                  ? 'bg-primary/10 border border-primary/20 text-primary'
                  : 'hover:bg-white/[0.03] text-on-surface'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 text-center text-xs font-mono text-on-surface-variant">
                  {isCurrent && isPlaying ? (
                    <span className="material-symbols-outlined text-[16px] text-primary animate-pulse">
                      equalizer
                    </span>
                  ) : (
                    String(idx + 1).padStart(2, '0')
                  )}
                </span>
                <img
                  src={song.coverImage}
                  alt={song.title}
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0 ring-1 ring-white/5"
                />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                    {song.title}
                  </p>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {song.artistNames}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-on-surface-variant/70 pl-2">
                {song.durationFormatted || formatTime(song.duration)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
