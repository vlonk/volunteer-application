const Events = require('../models/eventsModel');

//read the events from the db
const getEvents = async (req, res) => {
    try{
        const events = await Events.find();
        res.status(200).json(events); // Send events as JSON response
        return events;

    } catch (error){
        console.error("Error fetching events:", error);
        res.status(500).send("Error fetching events from DB");    }

};

// for creating events
const createEvent = async (req, res) => {
    try {
        const newEvent = req.body; // new event data from request body
        delete newEvent.id;

        console.log("Incoming data:" ,newEvent);
        const event = new Events(newEvent);
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
const getMatchingEvents = async (req, res) => {  // user skills are input
    try {
        const events = await getEvents();    // getting all events from mongo
        const userSkills = req.body.skills.split(",");    // converting the skills from the user to an array to match events with
        const matchingEvents = events.filter(event => userSkills.some(skill => event.skills.includes(skill)));   // looking for events with skills from the user
  
        if (matchingEvents.length == 0) {
            return res.status(404).json({ message: "No matching event found" });
        }
  
        res.json(matchingEvents);
    } 
    catch (error) {
        res.status(500).json({ message: "Error reading event data", error });
    }
}

//when updating events from mongo
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;  // get the eventId from req
        const updatedData = req.body; //get updated data from request to later be sent to response
  
        const event = await Events.findById(eventId); // fetching the event by Id we already have
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

        const result = await Events.findByIdAndDelete(eventId); //deletes event by id, function from mongo
        if (!result){
            return res.status(404).json({message: "Event not found."});
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};

module.exports = {getEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent };