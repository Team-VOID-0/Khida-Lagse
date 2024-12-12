import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './Home.css'

const Home = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Login logic
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true)
      toast.success('Login Successful!')
      navigate('/delivery')
    } else {
      toast.error('Invalid Credentials')
      setIsAuthenticated(true)
    }
  }

  return (
    <div className="home-container">
      <div className="auth-card">
        <p className="auth-header">Login</p>
        <hr className='hr-home'/>
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
  )
}

export default Home
