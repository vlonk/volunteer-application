import React, { useState } from 'react';
import '../styles/signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show the popup when the form is submitted
    setShowPopup(true);

    // Simulate submitting the signup form
    console.log('Signing up with:', username, password);
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup when the user clicks 'Close'
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign up:</h1>

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

        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>

      {/* Popup for email verification */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Email Verification</h2>
            <p>Please verify your email before completing the sign-up process.</p>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;

