import { useState } from 'react'
import './App.css'
import FacialExpression from './components/FacialExpression'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FacialExpression />
    </>
  )
}

export default App
