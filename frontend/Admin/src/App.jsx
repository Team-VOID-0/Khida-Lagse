import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'

import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Order/Order'
import Dashboard from './pages/Dashboard/Dashboard'
import User from './pages/User/User'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './pages/Profile/Profile'
import Home from './pages/Home/Home'

const App = () => {

  // const url = "http://localhost:4000"

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-content">
        {location.pathname !== '/' && <Sidebar />}
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/add' element={<Add />}/>
          <Route path='/list' element={<List />}/>
          <Route path='/orders' element={<Orders />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/user' element={<User />}/>
          <Route path='/profile' element={<AdminProfile />}/>
        </Routes>
      </div>
    </div>
  )
}

export default App