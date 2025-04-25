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
          const eventDetails = eventHistory.events.map((event) => ({
            name: event.name,
            status: event.status,  // Include the status of the event
          }));
          return {
            userId: user.id,
            name: user.name,
            events: eventDetails,
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

//Controller to get info from an event based on its Id
const getSelectedEventInfo = async (req, res) => {
  try{
    console.log("Requested Event ID:", req.params.id);
    // check for a missing or invalid ID, will always trigger when page loads as no event has been picked yet
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({ message: "Invalid or missing Event ID." });
    }
    const event = await Event.findById(req.params.id);


    if (!event){
      return res.status(404).json({message: "Event not found."})
    }

    const reportData = {
      title: event.title,
      description: event.description,
      volunteers: event.volunteersList.map(v => ({
        id: v.id,
        name: v.name,
        assignment: v.assignment
      }))
    };

    res.status(200).json(reportData);
  } catch (error){
    console.error("Error fetching selected event.");
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllEventsForUsers, getSelectedEventInfo };