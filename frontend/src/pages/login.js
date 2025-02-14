import React, { useState } from 'react';
import '../styles/login.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., send data to an API
    console.log('Logging in with:', username, password);
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
      <link>
      <a href="/register">Don't have an account? Register here!</a>
      </link>
      <link>
      <a href="/register">Don't have an account? Register here!</a>
      </link>
    </form>
  );
}

export default LoginForm;