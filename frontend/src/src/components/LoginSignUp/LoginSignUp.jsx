import React, { useState } from 'react';
import { Form, FloatingLabel, Button } from 'react-bootstrap';
import './LoginSignUp.css';
import { assets } from '../../assets/ok/assets';
import Badge from 'react-bootstrap/Badge';

const LoginPopup = ({ setShowLogin, currentState, setCurrentState }) => {
    const [isOtpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        user_name: '',
        email: '',
        mobile_number: '',
        password: ''
    });
    const [jwtToken, setJwtToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async () => {
        const response = await fetch('http://localhost:8000/user_registration/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.detail === 'OTP Sent') {
            setOtpVisible(true);
        } else {
            alert(data.detail);
        }
    };

    const handleLogin = async () => {
        const response = await fetch('http://localhost:8000/user_login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: formData.user_name,
                password: formData.password,
            }),
        });
        const data = await response.json();
        if (data.access_token) {
            setJwtToken(data.access_token);
            localStorage.setItem("access_token", data.access_token);
            alert('Login successful!');
            setShowLogin(false);
        } else {
            setErrorMessage(data.detail || 'An error occurred');
            alert(data.detail);
        }
    };

    const handleVerifyOtp = async () => {
        const response = await fetch(`http://localhost:8000/verify_otp/${formData.email}/${otp}`, {
            method: 'GET',
        });
        const data = await response.json();
        if (data.detail === 'OTP used') {
            alert('Account created successfully!');
            setShowLogin(false);
        } else {
            alert(data.detail); // Handle invalid OTP
        }
    };

    return (
        <div className='login-popup'>
            <Form className="login-popup-container">
                <div className="login-popup-title">
                    <h2 className='title'>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                {!isOtpVisible ? (
                    <div className="login-popup-input">
                        {currentState === "Sign Up" && (
                            <>
                                <FloatingLabel controlId="floatingName" label="Your name" className="mb-3">
                                    <Form.Control
                                        name='name'
                                        type="text"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingUsername" label="Enter username" className="mb-3">
                                    <Form.Control
                                        name='user_name'
                                        type="text"
                                        placeholder="Enter username"
                                        value={formData.user_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingEmail" label="Your email" className="mb-3">
                                    <Form.Control
                                        name='email'
                                        type="email"
                                        placeholder="Your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingMobile" label="Your Mobile Number" className="mb-3">
                                    <Form.Control
                                        name='mobile_number'
                                        type="text"
                                        placeholder="Your Mobile Number"
                                        value={formData.mobile_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>
                            </>
                        )}
                        {currentState === "Login" && (
                            <FloatingLabel controlId="floatingUsername" label="Enter username" className="mb-3">
                                <Form.Control
                                    name='user_name'
                                    type="text"
                                    placeholder="Enter username"
                                    value={formData.user_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FloatingLabel>
                        )}
                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                            <Form.Control
                                name='password'
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                disabled={isOtpVisible}
                            />
                        </FloatingLabel>
                        <Button type='button' className="login-popup-button" onClick={currentState === "Sign Up" ? handleSignUp : handleLogin}>
                            {currentState === "Sign Up" ? "Create account" : "Login"}
                        </Button>
                    </div>
                ) : (
                    <div className="login-popup-input">
                        <p className="otp-message">
                            An OTP is sent to your mail. Check it please!
                        </p>
                        <FloatingLabel controlId="floatingEmail" label="Your email" className="mb-3">
                            <Form.Control
                                name='email'
                                type="email"
                                placeholder="Your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingOtp" label="Enter OTP" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <Button type='button' className="login-popup-button" onClick={handleVerifyOtp}>
                            Verify OTP
                        </Button>
                    </div>
                )}
                {currentState === "Login" ? (
                    <p className='already-have-or-create'>
                        Create a new account?{' '}
                        <span onClick={() => setCurrentState("Sign Up")}>
                            <Badge bg="success" style={{ color: "white", textDecoration: "none" }}>Sign Up</Badge>
                        </span>
                    </p>
                ) : (
                    <p id='already' className='already-have-or-create'>
                        Already have an account?{' '}
                        <span onClick={() => setCurrentState("Login")}>
                            <Badge bg="warning" style={{ color: "black", textDecoration: "none" }}>Log in</Badge>
                        </span>
                    </p>
                )}
                {/* {errorMessage && <p className="error-message">{errorMessage}</p>} */}
            </Form>
        </div>
    );
};

export default LoginPopup;