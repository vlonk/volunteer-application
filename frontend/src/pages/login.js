import React, { useState } from 'react';
import '../styles/login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // make a POST request to your backend
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username , password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // data.token has the JWT if you want to store it
        // localStorage.setItem('token', data.token);
      } else {
        console.error('Login failed:', data.msg);
        alert(`Login failed: ${data.msg}`);
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
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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