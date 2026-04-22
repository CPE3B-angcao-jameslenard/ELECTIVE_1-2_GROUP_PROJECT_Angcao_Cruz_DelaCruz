import React, { useState } from 'react';

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5005/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Account created.");
        onClose(); // Close the form after success
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Signup error details:", err);
      alert("Backend is not running!");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Join DISHcovery</h2>
        <form onSubmit={handleSignup}>
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
          Already have an account? <span onClick={onSwitchToLogin}>Log in here</span>
        </p>
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;