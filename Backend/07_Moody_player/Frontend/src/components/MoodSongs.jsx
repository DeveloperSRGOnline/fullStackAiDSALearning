import React, { useState, useRef, useEffect } from 'react'
import "./MoodSongs.css"

const MoodSongs = ({ Songs = [] }) => {
    const [currentSong, setCurrentSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    const handlePlayPause = (song) => {
        if (currentSong === song) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentSong(song)
            setIsPlaying(true)
        }
    }

    const togglePlayPause = () => {
        if (!currentSong) {
            if (Songs.length > 0) {
                setCurrentSong(Songs[0])
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
        setIsPlaying(true)
    }

    const handlePrev = () => {
        if (!Songs.length) return
        const currentIndex = Songs.findIndex((s) => s === currentSong)
        const prevIndex = (currentIndex - 1 + Songs.length) % Songs.length
        setCurrentSong(Songs[prevIndex])
        setIsPlaying(true)
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

            {/* Simple Controller Bar */}
            <div className="controller-bar">
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

                <audio
                    ref={audioRef}
                    src={currentSong ? currentSong.url : ""}
                    onEnded={handleNext}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
        </div>
    )
}

export default MoodSongs