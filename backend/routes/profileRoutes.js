const express = require("express")

const router = express.Router();

const { getAllUsers, getProfile, updateProfile } = require('../controllers/profileController');

//for getting all users
router.get("/api/profiles", getAllUsers);
//route for getting the user profile
router.get("/api/profile/:id", getProfile);
//route to update a users profile
router.put("/api/profile/:id", updateProfile);

module.exports=router;