import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'

const App = () => {
  const [showLogin,setShowLogin] =useState(false)
  const [currentState, setCurrentState] = useState('Login')

  return (
    <>
      <div id='home'>
        <Navbar setShowLogin={setShowLogin} setCurrentState={setCurrentState}/>
      </div>
    </>
  )
}

export default App
