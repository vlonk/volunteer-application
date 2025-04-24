const User = require('../models/userModel'); // Import User model

// Get all users with their event history
const getAllUsersWithEventHistory = async (req, res) => {
  try {
    // Fetch all users from MongoDB
    const users = await User.find(); 

    // If no users found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Map the users to include their event history (eventId and eventName)
    const usersWithEventHistory = users.map(user => ({
      id: user.id,
      name: user.name,
      eventHistory: user.eventhistoryId ? {
        eventId: user.eventhistoryId, 
        eventName: user.eventName // Adjust this based on your model or event data structure
      } : null
    }));

    // Return the users with event history data
    res.json(usersWithEventHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users with event history', error });
  }
};

module.exports = { getAllUsersWithEventHistory };
