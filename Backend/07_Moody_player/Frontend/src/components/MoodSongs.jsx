import React, { useState, useRef, useEffect } from 'react'
import "./MoodSongs.css"

const MoodSongs = ({ Songs = [] }) => {
    const [currentSong, setCurrentSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef(null)

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00"
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = Math.floor(timeInSeconds % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    const handlePlayPause = (song) => {
        if (currentSong === song) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentSong(song)
            setCurrentTime(0)
            setDuration(0)
            setIsPlaying(true)
        }
    }

    const togglePlayPause = () => {
        if (!currentSong) {
            if (Songs.length > 0) {
                setCurrentSong(Songs[0])
                setCurrentTime(0)
                setDuration(0)
                setIsPlaying(true)
            }
            return
        }
        setIsPlaying(!isPlaying)
    }

    const handleNext = () => {
        if (!Songs.length) return
        const currentIndex = Songs.findIndex((s) => s === currentSong)
        const nextIndex = (currentIndex + 1) % Songs.length
        setCurrentSong(Songs[nextIndex])
        setCurrentTime(0)
        setDuration(0)
        setIsPlaying(true)
    }

    const handlePrev = () => {
        if (!Songs.length) return
        const currentIndex = Songs.findIndex((s) => s === currentSong)
        const prevIndex = (currentIndex - 1 + Songs.length) % Songs.length
        setCurrentSong(Songs[prevIndex])
        setCurrentTime(0)
        setDuration(0)
        setIsPlaying(true)
    }

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration || 0)
        }
    }

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value)
        setCurrentTime(newTime)
        if (audioRef.current) {
            audioRef.current.currentTime = newTime
        }
    }

    useEffect(() => {
        if (!audioRef.current || !currentSong) return

        if (isPlaying) {
            audioRef.current.play().catch((err) => {
                console.log("Audio playback error:", err)
            })
        } else {
            audioRef.current.pause()
        }
    }, [currentSong, isPlaying])

    const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

    return (
        <div className='mood-songs'>
            <h2>Recommended Songs</h2>

            <div className='songs-list'>
                {Songs && Songs.length > 0 ? (
                    Songs.map((song, index) => (
                        <div
                            className={`song ${currentSong === song ? 'active-song' : ''}`}
                            key={index}
                            onClick={() => handlePlayPause(song)}
                        >
                            <div className='title'>
                                <h3>{song.title}</h3>
                                <p>{song.artist}</p>
                            </div>
                            <div className="play-pause-button">
                                {currentSong === song && isPlaying ? (
                                    <i className="ri-pause-line"></i>
                                ) : (
                                    <i className="ri-play-circle-fill"></i>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-songs">No songs available</p>
                )}
            </div>

            {/* Controller Bar with Song Timeline / Scrubber */}
            <div className="controller-bar">
                <div className="controller-top">
                    <div className="controller-info">
                        <h4>{currentSong ? currentSong.title : "No track selected"}</h4>
                        <p>{currentSong ? currentSong.artist : "Select a song to play"}</p>
                    </div>

                    <div className="controller-controls">
                        <button
                            className="ctrl-btn"
                            onClick={handlePrev}
                            disabled={!currentSong}
                            title="Previous"
                        >
                            <i className="ri-skip-back-fill"></i>
                        </button>

                        <button
                            className="ctrl-btn play-btn"
                            onClick={togglePlayPause}
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <i className="ri-pause-circle-fill"></i>
                            ) : (
                                <i className="ri-play-circle-fill"></i>
                            )}
                        </button>

                        <button
                            className="ctrl-btn"
                            onClick={handleNext}
                            disabled={!currentSong}
                            title="Next"
                        >
                            <i className="ri-skip-forward-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Timeline / Seek Bar */}
                <div className="timeline-container">
                    <span className="time-display">{formatTime(currentTime)}</span>
                    <div className="timeline-slider-wrapper">
                        <input
                            type="range"
                            className="timeline-slider"
                            min="0"
                            max={duration || 0}
                            step="0.1"
                            value={currentTime}
                            onChange={handleSeek}
                            disabled={!currentSong}
                            title="Seek"
                            style={{
                                background: `linear-gradient(to right, #72c515 0%, #57950f ${progressPercent}%, rgba(255, 255, 255, 0.15) ${progressPercent}%, rgba(255, 255, 255, 0.15) 100%)`
                            }}
                        />
                    </div>
                    <span className="time-display">{formatTime(duration)}</span>
                </div>

                <audio
                    ref={audioRef}
                    src={currentSong ? currentSong.url : ""}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onDurationChange={handleLoadedMetadata}
                    onEnded={handleNext}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
        </div>
    )
}

export default MoodSongs