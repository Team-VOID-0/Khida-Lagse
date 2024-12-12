import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { MdSettingsSuggest } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/delivery' className="sidebar-option">
          <LocalShippingIcon className='icons'/>
          <p>Delivery</p>
        </NavLink>
        <NavLink to='/completed' className="sidebar-option">
          <BiTask className='icons'/>
          <p>Completed</p>
        </NavLink>
        <NavLink to='/profile' className="sidebar-option">
          <MdSettingsSuggest className='icons'/>
          <p>Settings</p>
        </NavLink>
        <NavLink to='/' className="sidebar-option">
          <IoLogOut className='icons'/>
          <p>Logout</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar