const fs = require("fs").promises;
const path = require("path");

const eventsFilePath = path.join(__dirname, "../data/events.json");

//read the events.json file, parse into JS object
const getEvents = async () => {
    const data = await fs.readFile(eventsFilePath, "utf8")
    return JSON.parse(data);
};

//save info to events.js
const saveEvents = async (events) => {
    await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));
};

//get list of all events and info
const getAllEvents = async (req, res) => {
    try{
        const events = await getEvents();
        res.json(events); //Respond with events data as JSON
    } catch (error) {
        res.status(500).json ({ message: "Error with fetching all events", error});
    }
};

// for creating events
const createEvent = async (req, res) => {
    try {
        const events = await getEvents();
        const newEvent = req.body; // new event data from request body

        // new ID for the event, iterates to find available value
        let newId = 1;
        while (events.hasOwnProperty(newId.toString())) {
            newId++;
        }

        events[newId] = { 
            id: newId, 
            volunteerId: [], // making empty list of volunteers
            ...newEvent 
        };
        await saveEvents(events);

        res.status(201).json({
            message: "Event created successfully",
            event: { id: newId, ...newEvent }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating event", error });
    }
};


//get a matching event
const getMatchingEvents = async (req, res) => {  // user skills are input
    try {
        const events = await getEvents();    // events are fetched
        const userSkills = req.body.skills.split(",");    // converting the skills from the user to an array to match events with
        const matchingEvents = Object.values(events).filter(event => userSkills.some(skill => event.skills.includes(skill)));   // looking for events with skills from the user
  
        if (matchingEvents.length == 0) {
            return res.status(404).json({ message: "No matching event found" });
        }
  
        res.json(matchingEvents);
    } 
    catch (error) {
        res.status(500).json({ message: "Error reading event data", error });
    }
}

//when updating events
const updateEvent = async (req, res) => {
    try {
        const events = await getEvents();
        const eventId = req.params.id;  // get the eventId from req
        const updatedData = req.body; //get updated data from request to later be sent to response
  
        if (!events[eventId]) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        //loop through keys in updated data and update correct object
        Object.keys(updatedData).forEach((key) => {
          events[eventId][key] = updatedData[key];
    });
        //success
        await saveEvents(events);
        res.json({ message: "Event updated successfully", event: events[eventId] });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating event", error });
    }
  };

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        let events = await getEvents();
        const eventId = req.params.id;

        if (!events[eventId]){
            return res.status(404).json({message: "Event not found."});
        }
        delete events[eventId];

        await saveEvents(events);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};

module.exports = { getAllEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent };