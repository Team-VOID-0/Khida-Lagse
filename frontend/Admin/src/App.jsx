import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import Home from './pages/Home/Home'

const App = () => {

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-content">
        {location.pathname !== '/' && <Sidebar />}
        <Routes>
          <Route path='/' element={<Home />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App