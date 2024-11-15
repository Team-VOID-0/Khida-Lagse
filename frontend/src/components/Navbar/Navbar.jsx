import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import './Navbar.css';

const BasicExample = ({setShowLogin, setCurrentState}) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('home');

  return (
    <Navbar expand="lg" className='navbar'>
      <Container>
        <Navbar.Brand className="brand-text">
          <Link to='/'><img src={logo} alt="Logo" /></Link>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto d-none d-lg-flex">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              className={activeKey === 'home' ? 'active-nav' : ''}
              onClick={() => setActiveKey('home')}
            >
              home
            </Nav.Link>
            <Nav.Link 
              href="#menu" 
              className={activeKey === 'menu' ? 'active-nav' : ''}
              onClick={() => setActiveKey('menu')}
            >
              menu
            </Nav.Link>
            <Nav.Link 
              href="#mobile" 
              className={activeKey === 'mobile-app' ? 'active-nav' : ''}
              onClick={() => setActiveKey('mobile-app')}
            >
              mobile-app
            </Nav.Link>
            <Nav.Link 
              href="#footer" 
              className={activeKey === 'contact-us' ? 'active-nav' : ''}
              onClick={() => setActiveKey('contact-us')}
            >
              contact-us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="navbar-icons">
          <button className="icon-button">
            <FaSearch />
          </button>
          <button className="icon-button">
            <FaShoppingCart />
          </button>

          <NavDropdown title={<FaUser />} id="user-nav-dropdown" align="end" className="icon-button user-icon-button" hidden>
            <NavDropdown.Item href="#orders" className='dropdown-item'>Orders</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#profile" className='dropdown-item'>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#logout" className='dropdown-item'>Logout</NavDropdown.Item>
          </NavDropdown>            
          <div className="auth-buttons">
            <button className="signup-button" onClick={()=>{setCurrentState("Sign Up"); setShowLogin(true); }}>Sign Up</button>
            <button className="login-button"onClick={()=>{setCurrentState("Login"); setShowLogin(true); }}><span className='login-btn-text'>Log in</span></button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
