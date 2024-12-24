import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Order/Order';
import Dashboard from './pages/Dashboard/Dashboard';
import User from './pages/User/User';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminProfile from './pages/Profile/Profile';
import Home from './pages/Home/Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check for token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <hr />
      <div className="app-content">
        {location.pathname !== '/' && <Sidebar />}
        <Routes>
          {/* Redirect '/' to '/dashboard' if authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Home setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
