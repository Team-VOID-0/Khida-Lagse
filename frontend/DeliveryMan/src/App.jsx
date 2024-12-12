import React, { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Delivery from './pages/Delivery/Delivery'
import CompletedOrdersDashboard from './pages/Completed/Completed'
import AdminProfile from './pages/Profile/Profile'
import Home from './pages/Home/Home'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  return (
    <div>
      <ToastContainer />
      
      <Navbar />
      <hr />

      <div className="app-content">
        {isAuthenticated && location.pathname !== '/' && <Sidebar />}
        
        <Routes>
          {/* Home route */}
          <Route 
            path='/' 
            element={<Home setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Authentication routes */}
          <Route 
            path='/login' 
            element={<Home setIsAuthenticated={setIsAuthenticated} />} 
          />

          {/* Protected routes */}
          <Route 
            path='/delivery' 
            // element={isAuthenticated ? <Delivery /> : <Navigate to="/" />} 
            element={isAuthenticated ? <Delivery /> : <Navigate to="/" />} 
          />
          <Route 
            path='/completed' 
            element={isAuthenticated ? <CompletedOrdersDashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path='/profile' 
            element={isAuthenticated ? <AdminProfile /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </div>
  )
}

export default App