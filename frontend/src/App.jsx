// // import React, { useState } from 'react'
// // import { Route, Routes } from 'react-router-dom'
// // import Navbar from './components/Navbar/Navbar'
// // import Home from './pages/Home/Home'
// // import Footer from './components/Footer/Footer'
// // import LoginPopup from './components/LoginSignUp/LoginSignUp'
// // import Profile from './pages/User/Profile/Profile'

// // const App = () => {
// //   const [showLogin,setShowLogin] =useState(false)
// //   const [currentState, setCurrentState] = useState('Login')

// //   return (
// //     <>
// //     {showLogin?<LoginPopup setShowLogin={setShowLogin} currentState={currentState} setCurrentState={setCurrentState} />:<></>}
// //       <div id='home'>
// //         <Navbar setShowLogin={setShowLogin} setCurrentState={setCurrentState}/>
// //         <Routes>
// //             <Route path='/' element={<Home/>} />  
// //             <Route path='/profile' element={<Profile/>} />  
// //         </Routes>
// //         <Footer/>
// //       </div>
// //     </>
// //   )
// // }

// // export default App


// import React, { useState, useEffect } from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Navbar from './components/Navbar/Navbar'
// import Home from './pages/Home/Home'
// import Footer from './components/Footer/Footer'
// import LoginPopup from './components/LoginSignUp/LoginSignUp'
// import Profile from './pages/User/Profile/Profile'

// const App = () => {
//   const [showLogin, setShowLogin] = useState(false)
//   const [currentState, setCurrentState] = useState('Login')
//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   // Check for existing token on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('access_token')
//     setIsLoggedIn(!!token)
//   }, [])

//   // Logout function to clear token and update state
//   const handleLogout = () => {
//     localStorage.removeItem('access_token')
//     setIsLoggedIn(false)
//   }

//   return (
//     <>
//     {showLogin && (
//       <LoginPopup 
//         setShowLogin={setShowLogin} 
//         currentState={currentState} 
//         setCurrentState={setCurrentState}
//         setIsLoggedIn={setIsLoggedIn} // Pass this prop to update login state
//       />
//     )}
//       <div id='home'>
//         <Navbar 
//           setShowLogin={setShowLogin} 
//           setCurrentState={setCurrentState}
//           isLoggedIn={isLoggedIn}
//           handleLogout={handleLogout}
//         />
//         <Routes>
//             <Route path='/' element={<Home/>} />  
//             <Route path='/profile' element={<Profile/>} />  
//         </Routes>
//         <Footer/>
//       </div>
//     </>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginSignUp/LoginSignUp'
import Profile from './pages/User/Profile/Profile'
import OrderPage from './pages/Order/Order'
import { CartProvider } from './context/CartContext'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [currentState, setCurrentState] = useState('Login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check for existing token on component mount and whenever the page loads
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [showLogin]) // Add showLogin to dependency array to update on login

  // Logout function to clear token and update state
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
  }

  return (
    <CartProvider>
      <>
      {showLogin && (
        <LoginPopup 
          setShowLogin={setShowLogin} 
          currentState={currentState} 
          setCurrentState={setCurrentState}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
        <div id='home'>
          <Navbar 
            setShowLogin={setShowLogin} 
            setCurrentState={setCurrentState}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
          <Routes>
              <Route path='/' element={<Home/>} />  
              <Route path='/profile' element={<Profile/>} />  
              <Route path='/order' element={<OrderPage />} />  
          </Routes>
          <Footer/>
        </div>
      </>
    </CartProvider>
  )
}

export default App