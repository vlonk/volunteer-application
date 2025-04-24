import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.id); // Store the ID from the backend
        console.log('Token and ID stored:', localStorage.getItem('authToken'), localStorage.getItem('userId'));
        
        window.dispatchEvent(new Event("storage"));
        
        navigate('/home');
      } else {
        const data = await response.json();  // Safely parsing the response in case of failure
        console.error('Login failed:', data.msg || 'Unknown error');
        alert(`Login failed: ${data.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login:</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-button">Login</button>
    </form>
  );
}

export default LoginForm;