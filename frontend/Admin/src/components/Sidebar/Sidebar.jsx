import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { PiUserListFill } from "react-icons/pi";
import { FaClipboardList } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option">
          <MdSpaceDashboard className='icons'/>
          <p>Dashboard</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <FaClipboardList className='icons'/>
          <p>Orders List</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <MdFastfood className='icons'/>
          <p>Food Items List</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <IoAddCircle className='icons'/>
          <p>Add Food Item</p>
        </NavLink>
        <NavLink to='/user' className="sidebar-option">
          <PiUserListFill className='icons'/>
          <p>User List</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar