const Event = require('../models/eventsModel');
const User = require('../models/userModel'); // Import the User model


//read the events from the db

const getAllEvents = async (req, res) => {
    try{
        const events = await Event.find();
        res.status(200).json(events); // Send events as JSON response
        return events;

    } catch (error){
        console.error("Error fetching events:", error);
        res.status(500).send("Error fetching events from DB");    }

};
// works for matching events
const getEvents = async () => {
    try {
        console.log("Fetching events from the database...");

        const events = await Event.find(); // Assuming you are using Mongoose
        console.log("Events fetched:", events); // Log the fetched events

        if (!events || events.length === 0) {
            console.log("No events found.");
            return [];
        }

        return events;
    } catch (error) {
        console.error("Error fetching events:", error); // Log any errors from fetching events
        throw new Error("Error fetching events");
    }
};


// for creating events
const createEvent = async (req, res) => {
    try {
        const newEvent = req.body; // new event data from request body
        delete newEvent.id;

        console.log("Incoming data:" ,newEvent);
        const event = new Event(newEvent);
        await event.save();

        // mongo db makes the id, do not need to make them here anymore

        res.status(201).json({
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating event", error });
    }
};


//get a matching event
const getMatchingEvents = async (req, res) => {
    try {
        console.log('User ID from request params:', req.params.id);

        // Fetch user by custom ID
        const user = await User.findOne({ id: req.params.id });
        console.log('User found:', user);

        if (!user) {
            console.log('User not found with ID:', req.params.id);
            return res.status(404).json({ message: 'User not found' });
        }

        const userSkills = user.skills;
        console.log('User Skills:', userSkills); // Log the skills of the user

        if (!Array.isArray(userSkills)) {
            return res.status(500).json({ message: 'User skills are not in the expected array format' });
        }

        // Fetch events
        const events = await getEvents();
        console.log('Events fetched in getMatchingEvents:', events); // Log the events

        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events available' });
        }

        // Find matching events based on user skills
        const matchingEvents = events.filter(event =>
            userSkills.some(skill => event.selectedSkills && event.selectedSkills.includes(skill))
        );
        console.log('Matching Events:', matchingEvents); // Log the matching events

        if (matchingEvents.length === 0) {
            return res.status(404).json({ message: 'No matching events found' });
        }

        return res.json(matchingEvents); // Send matching events to the client
    } catch (error) {
        console.error("Error in getMatchingEvents:", error);
        return res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};


//when updating events from mongo
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;  // get the eventId from req
        const updatedData = req.body; //get updated data from request to later be sent to response
  
        const event = await Event.findById(eventId); // fetching the event by Id we already have
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        //loop through keys in updated data and update correct object
        Object.keys(updatedData).forEach((key) => {
          event[key] = updatedData[key];
    });
        //success
        await event.save();     // functionality from mongo
        res.json({ message: "Event updated successfully", event});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating event", error });
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