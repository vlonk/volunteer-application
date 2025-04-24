const Event = require('../models/eventsModel');
const User = require('../models/userModel');

const getVolunteerParticipationReport = async (req, res) => {
  try {
    // Fetch all events and populate the volunteers list
    const events = await Event.find().populate('volunteersList');

    // Create a map to track volunteer participation
    const volunteerParticipation = {};

    // Loop through events and build the report
    events.forEach(event => {
      event.volunteersList.forEach(volunteerId => {
        // Fetch the user by their ID
        User.findById(volunteerId).then(user => {
          if (!volunteerParticipation[user.email]) {
            volunteerParticipation[user.email] = {
              _id: user._id,
              email: user.email,
              events: [],
            };
          }

          // Add event details to the volunteer's event history
          volunteerParticipation[user.email].events.push({
            title: event.title,
            date: event.date,
            location: event.location,
          });
        });
      });
    });

    // Convert the map to an array
    const reportData = Object.values(volunteerParticipation);

    // Return the report data as JSON
    return res.json(reportData);
  } catch (err) {
    return res.status(500).json({
      message: "Error generating the volunteer participation report",
      error: err.message,
    });
  }
};

module.exports = { getVolunteerParticipationReport };
