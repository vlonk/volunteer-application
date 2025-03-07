const express = require("express")

const router = express.Router();

const { getAllEvents, createEvent, getMatchingEvents, updateEvent, deleteEvent} = require('../controllers/eventsController');

//for getting all events
router.get("/api/events", getAllEvents);
//route for getting the matching events
router.get("/api/matching-events", getMatchingEvents);
//route for creating new events
router.post("/api/events", createEvent);
//route for updating an event
router.put("/api/events/:id", updateEvent);
//route to delete an event
router.delete("/api/events/:id", deleteEvent);

module.exports=router;