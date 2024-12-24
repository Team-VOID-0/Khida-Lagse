// import React, { useState } from 'react';
// import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
// import logo from '../../assets/logo.png';
// import './Navbar.css';

// const BasicExample = ({ setShowLogin, setCurrentState }) => {
//   const navigate = useNavigate();
//   const [activeKey, setActiveKey] = useState('home');
//   const location = useLocation(); // Get the current route location

//   return (
//     <Navbar expand="lg" className="navbar">
//       <Container>
//         <Navbar.Brand className="brand-text">
//           <Link to="/"><img src={logo} alt="Logo" /></Link>
//         </Navbar.Brand>
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="mx-auto d-none d-lg-flex">
//             <Nav.Link 
//               as={NavLink} 
//               to="/" 
//               className={activeKey === 'home' ? 'active-nav' : ''}
//               onClick={() => setActiveKey('home')}
//             >
//               home
//             </Nav.Link>
//             <Nav.Link 
//               href="#menu" 
//               className={activeKey === 'menu' ? 'active-nav' : ''}
//               onClick={() => setActiveKey('menu')}
//             >
//               menu
//             </Nav.Link>
//             <Nav.Link 
//               href="#mobile" 
//               className={activeKey === 'mobile-app' ? 'active-nav' : ''}
//               onClick={() => setActiveKey('mobile-app')}
//             >
//               mobile-app
//             </Nav.Link>
//             <Nav.Link 
//               href="#footer" 
//               className={activeKey === 'contact-us' ? 'active-nav' : ''}
//               onClick={() => setActiveKey('contact-us')}
//             >
//               contact-us
//             </Nav.Link>
//           </Nav>
//         </Navbar.Collapse>
//         <div className="navbar-icons">
//           <button className="icon-button">
//             <FaSearch />
//           </button>
//           <button className="icon-button">
//             <FaShoppingCart />
//           </button>

//           {/* Conditionally render the user button and dropdown */}
//           {location.pathname !== '/' && (
//             <NavDropdown title={<FaUser />} id="user-nav-dropdown" align="end" className="icon-button user-icon-button">
//               <NavDropdown.Item href="#orders" className="dropdown-item">Orders</NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#profile" className="dropdown-item">Profile</NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item href="#logout" className="dropdown-item">Logout</NavDropdown.Item>
//             </NavDropdown>
//           )}

//           {/* Authentication buttons */}
//           <div className="auth-buttons">
//             <button className="signup-button" onClick={() => { setCurrentState("Sign Up"); setShowLogin(true); }}>Sign Up</button>
//             <button className="login-button" onClick={() => { setCurrentState("Login"); setShowLogin(true); }}><span className="login-btn-text">Log in</span></button>
//           </div>
//         </div>
//       </Container>
//     </Navbar>
//   );
// }

// export default BasicExample;



import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import logo from '../../assets/logo.png';
import './Navbar.css';

const BasicExample = ({ setShowLogin, setCurrentState }) => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('home');
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchContainerRef = useRef(null);

  // Handle search icon click
  const handleSearchClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setIsSearchOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement your search logic here
    console.log('Searching for:', searchQuery);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the search container
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery(''); // Clear search query when closing
      }
    };

    // Add click event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand className="brand-text">
          <Link to="/"><img src={logo} alt="Logo" /></Link>
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
          {/* Search functionality */}
          <div 
            className="search-container" 
            ref={searchContainerRef}
          >
            {!isSearchOpen ? (
              <button 
                className="icon-button" 
                onClick={handleSearchClick}
              >
                <FaSearch />
              </button>
            ) : (
              <form 
                onSubmit={handleSearchSubmit} 
                className="search-input-form"
              >
                <input 
                  type="text" 
                  placeholder="Search food items..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                  autoFocus
                />
              </form>
            )}
          </div>

          <button className="icon-button">
            <FaShoppingCart />
          </button>

          {/* Rest of the code remains the same */}
          {location.pathname !== '/' && (
            <NavDropdown 
              title={<FaUser />} 
              id="user-nav-dropdown" 
              align="end" 
              className="icon-button user-icon-button"
            >
              <NavDropdown.Item href="#orders" className="dropdown-item">Orders</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#profile" className="dropdown-item">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout" className="dropdown-item">Logout</NavDropdown.Item>
            </NavDropdown>
          )}

          {/* Authentication buttons */}
          <div className="auth-buttons">
            <button 
              className="signup-button" 
              onClick={() => { setCurrentState("Sign Up"); setShowLogin(true); }}
            >
              Sign Up
            </button>
            <button 
              className="login-button" 
              onClick={() => { setCurrentState("Login"); setShowLogin(true); }}
            >
              <span className="login-btn-text">Log in</span>
            </button>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default BasicExample;