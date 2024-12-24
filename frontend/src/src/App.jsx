import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginSignUp/LoginSignUp'
import Profile from './pages/User/Profile/Profile'

const App = () => {
  const [showLogin,setShowLogin] =useState(false)
  const [currentState, setCurrentState] = useState('Login')

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} currentState={currentState} setCurrentState={setCurrentState} />:<></>}
      <div id='home'>
        <Navbar setShowLogin={setShowLogin} setCurrentState={setCurrentState}/>
        <Routes>
            <Route path='/' element={<Home/>} />  
            <Route path='/profile' element={<Profile/>} />  
        </Routes>
        <Footer/>
      </div>
    </>
  )
}

export default App
