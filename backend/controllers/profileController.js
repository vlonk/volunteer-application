const User = require('../models/userModel'); // Import Mongoose model

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all users', error });
  }
};

// Get a single user by ID
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }); // Find user by ID

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Prevent modifying 'id' and 'role'
    delete updatedData.id;
    delete updatedData.role;

    const updatedUser = await User.findOneAndUpdate(
      { id }, // Find user by ID
      { $set: updatedData }, // Update fields
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

module.exports = { getAllUsers, getProfile, updateProfile };
