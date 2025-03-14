const fs = require("fs").promises;
const path = require("path");

// Define paths for the users and history data
const userFilePath = path.join(__dirname, "../data/users.json");
const historyFilePath = path.join(__dirname, "../data/history.json");

//We need get users because history items are lnked w/ user
const getUsers = async () => {
    const data = await fs.readFile(userFilePath, "utf8");
    return JSON.parse(data);
};

//Read the history.json file and parse it into a JavaScript object
const getHistory = async () => {
    const data = await fs.readFile(historyFilePath, "utf8");
    return JSON.parse(data);
};

const getAllEvents = async (req, res) => {
    console.log("called get all events");
    try {
        const users = await getUsers();
        const user = users[req.params.userId]; //get specific user info base on id

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const history = await getHistory();
        const userHistory = history[user.eventhistoryId];

        if (!userHistory) {
            return res.status(404).json({ message: "User history not found" });
        }

        res.json(userHistory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user events", error });
    }
};

//Get a specific event for a user by eventId
const getEvent = async (req, res) => {
    // console.log("called get single event");
    try {
        const users = await getUsers();
        const user = users[req.params.userId];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const history = await getHistory();
        const userHistory = history[user.eventhistoryId];

        if (!userHistory) {
            return res.status(404).json({ message: "User history not found" });
        }

        const event = userHistory.find(
            (event) => event.eventId === req.params.eventId
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error });
    }
};

// Function to update user history
const updateUserHistory = async (req, res) => {
    try {
      const userId = req.params.userId;  // Get user ID
      const updatedHistory = req.body;   // Get updated history from request
  
      // Load the user's history (assuming history is in a JSON file)
      const history = await getHistory();  // Assuming you have a method that fetches history.json
  
      const userHistoryKey = `history_${userId}`;
      if (!history[userHistoryKey]) {
        return res.status(404).json({ message: "User history not found" });
      }
  
      // Update the user's history
      history[userHistoryKey] = [
        ...history[userHistoryKey], // Existing events
        updatedHistory[updatedHistory.length - 1] // The newly added event
      ];  
      // Save the updated history
      await fs.writeFile(historyFilePath, JSON.stringify(history, null, 2));
        
      res.json({ message: "User history updated successfully", updatedHistory });
    } catch (error) {
      console.error("Error updating user history:", error);
      res.status(500).json({ message: "Error updating user history", error });
    }
  };
  

module.exports = { getAllEvents, getEvent, updateUserHistory };
