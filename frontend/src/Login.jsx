import React, { useState } from 'react';
import './Signup.css'; // We can reuse the exact same CSS!

// 1. Add onSwitchToSignup here
const Login = ({ onClose, onLoginSuccess, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Change this line in Login.jsx:
        const response = await fetch('http://localhost:5005/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Welcome back!");
        onLoginSuccess(data.user); // Tells App.jsx who just logged in
        onClose(); // Closes the modal
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Backend connection error.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
            {/* 2. ADD THIS NEW TEXT BELOW THE FORM */}
        <p className="auth-switch">
          Don't have an account? <span onClick={onSwitchToSignup}>Sign up here</span>
        </p>

          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;