import { useState } from 'react'
import './App.css'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'


function App() {

  const [Songs, setSongs] = useState([
    {
      title: "test title",
      artist: "test artist",
      url: "test url"
    },
    {
      title: "test title",
      artist: "test artist",
      url: "test url"
    },
    {
      title: "test title",
      artist: "test artist",
      url: "test url"
    },
    {
      title: "test title",
      artist: "test artist",
      url: "test url"
    },
    {
      title: "test title",
      artist: "test artist",
      url: "test url"
    },
  ])
  return (
    <div className="app-container">
      <div className="mood-player-card">
        <FacialExpression setSongs={setSongs} />
        <MoodSongs Songs={Songs} />
      </div>
    </div>
  )
}

export default App
