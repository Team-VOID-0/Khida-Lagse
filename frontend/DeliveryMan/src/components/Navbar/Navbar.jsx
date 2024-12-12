import React from 'react'
import { Link } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import './Navbar.css'
import logo from '../../assets/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='logo-container'>
        <img className='logo' src={logo} alt="Logo" />
        <span className='admin-panel-text'>Delivery Panel</span>
      </div>
    </div>
  )
}

export default Navbar