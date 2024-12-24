import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { MdSettingsSuggest } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Sidebar = () => {
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('access_token');
    // Redirect to the home page ('/')
    navigate('/');
  };

  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/delivery' className="sidebar-option">
          <LocalShippingIcon className='icons'/>
          <p>Delivery</p>
        </NavLink>
        {/* <NavLink to='/completed' className="sidebar-option">
          <BiTask className='icons'/>
          <p>Completed</p>
        </NavLink> */}
        <NavLink to='/profile' className="sidebar-option">
          <MdSettingsSuggest className='icons'/>
          <p>Settings</p>
        </NavLink>
        <div className="sidebar-option" onClick={handleLogout}>
          <IoLogOut className='icons'/>
          <p>Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;
