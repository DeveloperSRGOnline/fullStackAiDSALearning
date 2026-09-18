import { useState } from 'react'
import './App.css'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'
function App() {
  return (
    <div className="app-container">
      <div className="mood-player-card">
        <FacialExpression />
        <MoodSongs />
      </div>
    </div>
  )
}

export default App
