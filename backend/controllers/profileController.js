//this is just for local when we have no db
const fs = require("fs").promises;
const path = require("path");

//also wont need when we implement db, define the actual location of our data
const userFilePath = path.join(__dirname,"../data/users.json")

//read the user.json file, parse into JS object
const getUsers = async () => {
    const data = await fs.readFile(userFilePath, "utf8")
    return JSON.parse(data);
};

//save info to users.js
const saveUsers = async (users) => {
    await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
};

//get list of all users and attributes
const getAllUsers = async (req, res) => {
    //console.log("called get all users")
    try{
        const users = await getUsers();
        res.json(users); //Respond with users data as JSON
    } catch (error) {
        res.status(500).json ({ message: "Error with fetching all users", error});
    }
};

//get a single user profile
const getProfile = async (req, res) => {
    console.log("called get 1 profile")
    try {
        const users = await getUsers();
        const user = users[req.params.id]; //Find user with 'id' from URL params
  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        res.json(user);
    } 
    catch (error) {
        res.status(500).json({ message: "Error reading user data", error });
    }
}

//when updating profile
const updateProfile = async (req, res) => {
    console.log("called update profile")
    try {
        const users = await getUsers();
        const userId = req.params.id;
        const updatedData = req.body; //get updated data from request to later be sent to response
  
        if (!users[userId]) {
            return res.status(404).json({ message: "User not found" });
        }
        
        //loop through keys in updated data and update correct object
        Object.keys(updatedData).forEach((key) => {
        if (!["id", "role"].includes(key)) { //to make sure id and role are not modified
          users[userId][key] = updatedData[key];
        }
    });
        //success
        await saveUsers(users);
        res.json({ message: "Profile updated successfully", user: users[userId] });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile", error });
    }
  };

  module.exports = { getAllUsers, getProfile, updateProfile };