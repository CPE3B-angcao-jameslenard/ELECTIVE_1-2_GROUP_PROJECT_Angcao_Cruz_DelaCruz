import React, { useState } from 'react';
import './Signup.css'; 
import Swal from 'sweetalert2';

const Login = ({ onClose, onLoginSuccess, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://elective-1-2-group-project-angcao-cruz.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        //SUCCESS POP-UP
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Logged in successfully! 👨‍🍳',
          icon: 'success',
          confirmButtonColor: '#4A5D23'
        });
        onLoginSuccess(data.user); 
        onClose(); 
      } else {
        //FAILED LOGIN POP-UP (Wrong password, etc.)
        Swal.fire({
          title: 'Oops!',
          text: data.error || 'Invalid username or password.',
          icon: 'error',
          confirmButtonColor: '#4A5D23'
        });
      }
    } catch (err) {
      console.error(err);
      //BACKEND CONNECTION POP-UP
      Swal.fire({
        title: 'Connection Error',
        text: 'The server is currently unresponsive. Please wait a moment while it wakes up!',
        icon: 'error',
        confirmButtonColor: '#4A5D23'
      });
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
  
          <p className="auth-switch">
            Don't have an account? <span onClick={onSwitchToSignup} style={{cursor: 'pointer', color: '#4A5D23', fontWeight: 'bold'}}>Sign up here</span>
          </p>

          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;