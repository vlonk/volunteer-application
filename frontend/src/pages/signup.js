import React, { useState } from 'react';
import '../styles/signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., send data to an API
    console.log('Logging in with:', username, password);
  };

  return (

    <form onSubmit={handleSubmit}>
      <div>
      <h1> Sign up: </h1>
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
      <button type="submit" className="signup-button">Signup</button>
    </form>
  );
}

export default Signup;