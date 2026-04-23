import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // FIX: Changed from localhost to your Render URL
      const response = await fetch('https://elective-1-2-group-project-angcao-cruz.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS POP-UP
        Swal.fire({
          title: 'Welcome to the Team!',
          text: 'Account created successfully. You can now log in! 👨‍🍳',
          icon: 'success',
          confirmButtonColor: '#4A5D23'
        });
        onClose(); 
      } else {
        // ERROR POP-UP (e.g., Username already taken)
        Swal.fire({
          title: 'Oops!',
          text: data.error || 'Something went wrong during signup.',
          icon: 'error',
          confirmButtonColor: '#4A5D23'
        });
      }
    } catch (err) {
      console.error("Signup error details:", err);
      Swal.fire({
        title: 'Connection Error',
        text: 'The Kitchen (Backend) is currently closed. Please try again in a minute!',
        icon: 'error',
        confirmButtonColor: '#4A5D23'
      });
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
          <p className="auth-switch">
            Already have an account? <span onClick={onSwitchToLogin} style={{cursor: 'pointer', color: '#4A5D23', fontWeight: 'bold'}}>Log in here</span>
          </p>
          <button type="submit" className="submit-btn">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;