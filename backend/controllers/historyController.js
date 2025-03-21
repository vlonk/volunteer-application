const mongoose = require("mongoose");
const User = require("../models/userModel"); // Assuming your User model is in the models directory
const EventHistory = require("../models/historyModel"); // Assuming your EventHistory model is in the models directory

// Get all events for a specific user
const getAllEvents = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.userId }); // Get user by custom id

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userHistory = await EventHistory.findOne({ id: user.eventhistoryId }); // Get user history using eventhistoryId

        if (!userHistory) {
            return res.status(404).json({ message: "User history not found" });
        }

        res.json(userHistory.events); // Assuming userHistory has an `events` field containing the user's events
    } catch (error) {
        res.status(500).json({ message: "Error fetching user events", error });
    }
};

// Get a specific event for a user by eventId
const getEvent = async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userHistory = await EventHistory.findOne({ id: user.eventhistoryId });

        if (!userHistory) {
            return res.status(404).json({ message: "User history not found" });
        }

        const event = userHistory.events.find(event => event.eventId === req.params.eventId); // Find specific event

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
};

// Update user history (add new event)
const updateUserHistory = async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID
        const updatedHistory = req.body; // Get updated history from request

        // Find the user by their ID
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the event history using the user's eventhistoryId
        const userHistory = await EventHistory.findOne({ id: user.eventhistoryId });

        if (!userHistory) {
            return res.status(404).json({ message: "User history not found" });
        }

        // Add the new event to the user's event history
        userHistory.events.push(updatedHistory[updatedHistory.length - 1]); // Assuming the new event is at the last position of updatedHistory

        // Save the updated history back to the database
        await userHistory.save();

        res.json({ message: "User history updated successfully", updatedHistory });
    } catch (error) {
        console.error("Error updating user history:", error);
        res.status(500).json({ message: "Error updating user history", error });
    }
};

module.exports = { getAllEvents, getEvent, updateUserHistory };
