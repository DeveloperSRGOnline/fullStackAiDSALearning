import React, { useState } from 'react';
import { createPlaylistApi } from '../../api/client';

export const CreatePlaylistModal = ({ isOpen, onClose, onPlaylistCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [moodSyncDynamic, setMoodSyncDynamic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const newPlaylist = await createPlaylistApi({
        name: name.trim(),
        description: description.trim(),
        isPublic,
        moodSyncDynamic,
      });

      if (onPlaylistCreated) {
        onPlaylistCreated(newPlaylist);
      }

      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Failed to create playlist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-surface-low border border-white/10 shadow-2xl p-6 sm:p-7 transform transition-all overflow-hidden"
      >
        {/* Emerald Backlight Aura */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/25">
              <span className="material-symbols-outlined text-[24px]">queue_music</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface">
                Create Playlist
              </h3>
              <p className="text-xs text-on-surface-variant">
                Add a new sound collection to your library
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Playlist Name */}
          <div>
            <label
              htmlFor="playlist-name-input"
              className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5"
            >
              Playlist Name <span className="text-primary">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">
                edit_note
              </span>
              <input
                id="playlist-name-input"
                type="text"
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midnight Biometric Vibes"
                className="w-full bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-primary/40 focus:bg-surface-container-high transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="playlist-desc-input"
              className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5"
            >
              Description <span className="text-on-surface-variant/50 font-normal">(optional)</span>
            </label>
            <textarea
              id="playlist-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist an emotional vibe or focus goal..."
              className="w-full bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 px-4 py-2.5 rounded-xl text-xs outline-none border border-transparent focus:border-primary/40 focus:bg-surface-container-high transition-all resize-none shadow-inner"
            />
          </div>

          {/* Switches Card */}
          <div className="p-3.5 rounded-2xl bg-surface-container/70 border border-white/[0.04] space-y-3">
            {/* Public Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">public</span>
                <div>
                  <p className="text-xs font-medium text-on-surface">Public Playlist</p>
                  <p className="text-[10px] text-on-surface-variant">
                    Visible to followers &amp; profile visitors
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Mood Sync Dynamic Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                <div>
                  <p className="text-xs font-medium text-on-surface">Mood Sync Dynamic</p>
                  <p className="text-[10px] text-on-surface-variant">
                    Auto-sort tracks using webcam emotion scan
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={moodSyncDynamic}
                  onChange={(e) => setMoodSyncDynamic(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-surface-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary hover:bg-primary-light text-black font-semibold text-xs shadow-[0_0_18px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">add_circle</span>
              <span>{isSubmitting ? 'Creating...' : 'Create Playlist'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
