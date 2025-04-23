const Event = require('../models/eventsModel');
const User = require('../models/userModel'); // Import the User model


//read the events from the db

const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find(); // Use `.lean()` for better performance
      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found" });
      }
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error: error.message });
    }
  };
  
// works for matching events
const getEvents = async () => {
    try {
        const events = await Event.find(); // Fetch all events from the database

        if (!Array.isArray(events)) {
            return res.status(500).json({ message: "Error fetching events", error: "Invalid event data" });
          }
        // If no events are found, log the result and return an empty array
        if (!events || events.length === 0) {
            return { message: "No events found", events: [] };
        }

        return events;
    } catch (error) {
        // Log the error and throw an object that can be handled by the caller
        throw new Error("Error fetching events from DB: " + error.message);
    }
};



// for creating events
const createEvent = async (req, res) => {
    try {
        const newEvent = req.body; // new event data from request body
        delete newEvent.id;

        const event = new Event(newEvent);
        await event.save();

        // mongo db makes the id, do not need to make them here anymore

        res.status(201).json({
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error });
    }
};


//get a matching event
const getMatchingEvents = async (req, res) => {
    try {
        console.log('User ID from request params:', req.params.id);

        // Fetch user by custom ID
        const user = await User.findOne({ id: req.params.id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userSkills = user.skills;

        if (!Array.isArray(userSkills)) {
            return res.status(500).json({ message: 'User skills are not in the expected array format' });
        }

        // Fetch events
        const events = await getEvents();
        // if (!Array.isArray(events)) {
        //     console.error("Error: events is not an array", events);
        //     return res.status(500).json({ message: "Error fetching events", error: "Invalid event data" });
        // }
        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events available' });
        }

        // Find matching events based on user skills
        const matchingEvents = events.filter(event =>
            userSkills.some(skill => event.selectedSkills && event.selectedSkills.includes(skill))
        );

        if (matchingEvents.length === 0) {
            return res.status(404).json({ message: 'No matching events found' });
        }

        return res.json(matchingEvents); // Send matching events to the client
    } catch (error) {
        console.error("Error in getMatchingEvents:", error);
        return res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};


const updateEvent = async (req, res) => {
    try {
      console.log("eventid:", req.params.id);
      console.log("updatedata:", req.body);
  
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
  };
  



// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const result = await Event.findByIdAndDelete(eventId); //deletes event by id, function from mongo
        if (!result){
            return res.status(404).json({message: "Event not found."});
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};

module.exports = {getAllEvents, getEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent };