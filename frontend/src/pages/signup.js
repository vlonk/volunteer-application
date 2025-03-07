import React, { useState } from 'react';
import '../styles/signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
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
      const response = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: '', email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Signup success:', data);
      // data.token is your JWT if you want to store it
      // localStorage.setItem('token', data.token);

      setShowPopup(true);
    } else {
      console.error('Signup failed:', data.msg);
      alert(`Signup failed: ${data.msg}`);
    }
  } catch (err) {
    alert(err.message);
  }
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
            type="password"
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

