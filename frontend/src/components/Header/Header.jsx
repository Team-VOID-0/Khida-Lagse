import React from 'react'
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import "./Header.css"
const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Order your <br /> favourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
            <a href="#menu"><Button variant="light">View Menu</Button>{' '}</a>
        </div>
    </div>
  )
}

export default Header