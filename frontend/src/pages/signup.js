import React, { useState } from 'react';
import '../styles/signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // Initialize error message
      let errorMessage = '';

      // Check if the email is valid
      if (!emailRegex.test(email)) {
        errorMessage += 'Your email is invalid. ';
      }

      // Check if the passwords match
      if (password !== confirmPassword) {
        errorMessage += 'Your passwords do not match. ';
      }

      // If there's any error, throw an error with the combined message
      if (errorMessage) {
        throw new Error(errorMessage);
      }

      // If everything is valid, simulate form submission
      console.log('Signed up with:', email, password);

    } catch (err) {
      // Show an alert with the combined error message
      window.alert(err.message);
      return;
    }
    setShowPopup(true)
  }

  const closePopup = () => {
    setShowPopup(false); // Close the popup when the user clicks 'Close'
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign up:</h1>

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
        <div>
          <label htmlFor="password">Confirm Password:</label>
          <input
            type="text"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">
          Sign up
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

