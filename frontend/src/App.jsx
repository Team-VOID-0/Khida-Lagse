import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'

const App = () => {
  const [showLogin,setShowLogin] =useState(false)
  const [currentState, setCurrentState] = useState('Login')

  return (
    <>
      <div id='home'>
        <Navbar setShowLogin={setShowLogin} setCurrentState={setCurrentState}/>
        <Home/>
        <Footer/>
      </div>
    </>
  )
}

export default App
