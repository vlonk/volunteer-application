const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (email, newUserId) => {
  try {
    // Setup mail transport (using your Gmail account credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,  // Replace with your Gmail address
        pass: process.env.AUTH_PASS     // Replace with your Gmail password
      }
    });

    // Construct the verification link
    const verificationLink = `https://d381dee9723cth.cloudfront.net/profile/${newUserId}`;

    // Set email options
    const mailOptions = {
      from: 'your-email@example.com',  // Replace with your Gmail address
      to: email,
      subject: 'Welcome to KiWe Care!',
      html: `
        <p>Welcome to KiWe Care! We're delighted to see that you will be using our platform to take steps into improving your community!</p>
        <p>Verify your email here: <a href="${verificationLink}">Verify your email</a></p>
        <p>Fill out your profile information to get started.</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Export the function
module.exports = sendWelcomeEmail;
