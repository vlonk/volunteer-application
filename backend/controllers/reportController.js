const User = require('../models/userModel');
const EventHistory = require('../models/historyModel');
const Event = require('../models/eventsModel'); // If necessary for event details

// Controller to fetch events for all users
const getAllEventsForUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find(); // Get all users
    
    // Loop through users and get their event histories
    const reportData = await Promise.all(
      users.map(async (user) => {
        const eventHistory = await EventHistory.findOne({ userId: user.id });

        if (eventHistory) {
          const eventNames = eventHistory.events.map((event) => event.name);
          return {
            userId: user.id,
            name: user.name,
            events: eventNames
          };
        }
        return null;
      })
    );

    // Filter out users with no events
    const filteredReportData = reportData.filter((item) => item !== null);

    // Send the result as JSON response
    res.json(filteredReportData);
  } catch (error) {
    console.error("Error fetching event data for users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllEventsForUsers };
