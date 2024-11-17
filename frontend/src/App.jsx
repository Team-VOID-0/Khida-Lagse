import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'

const App = () => {
  const [showLogin,setShowLogin] =useState(false)
  const [currentState, setCurrentState] = useState('Login')

  return (
    <>
      <div id='home'>
        <Navbar setShowLogin={setShowLogin} setCurrentState={setCurrentState}/>
        <Home/>
      </div>
    </>
  )
}

export default App
