// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import './Home.css'

// const Home = ({ setIsAuthenticated }) => {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault()

//     // Login logic
//     if (username === 'admin' && password === 'password') {
//       setIsAuthenticated(true)
//       toast.success('Login Successful!')
//       navigate('/dashboard')
//     } else {
//       toast.error('Invalid Credentials')
//       setIsAuthenticated(true)
//     }
//   }

//   return (
//     <div className="home-container">
//       <div className="auth-card">
//         <p className="auth-header">Login</p>
//         <hr className='hr-home'/>
//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label>Username</label>
//             <input 
//               type="text" 
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required 
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input 
//               type="password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required 
//             />
//           </div>

//           <button type="submit" className="submit-button">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Home




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct
import { toast } from 'react-toastify';
import './Home.css';

const Home = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API call to login endpoint
      const response = await fetch(`http://localhost:8000/user_login/${username}/${password}`);
      const data = await response.json();

      if (response.ok) {
        const { access_token } = data;

        // Save the token in localStorage
        localStorage.setItem('access_token', access_token);

        // Decode the token to get the role
        const decodedToken = jwtDecode(access_token);
        const role = decodedToken.role;

        // Check the role and navigate accordingly
        if (role === 'admin') {
          setIsAuthenticated(true);
          toast.success('Login Successful!');
          navigate('/dashboard');
        } else {
          toast.error('You are not authorized to access this page.');
          setIsAuthenticated(false);
        }
      } else {
        // Handle API errors (e.g., invalid credentials)
        toast.error(data.detail || 'Login failed.');
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Handle network or unexpected errors
      toast.error('An error occurred. Please try again.');
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="home-container">
      <div className="auth-card">
        <p className="auth-header">Login</p>
        <hr className="hr-home" />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
