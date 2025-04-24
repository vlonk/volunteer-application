import React, { useState, useEffect } from "react";
import "../styles/profileStyles.css";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker"; //fo calendar availability
import "react-datepicker/dist/react-datepicker.css";

//list of skills for skills dropdown section
const skillsList = [
    "Teamwork",
    "Organization",
    "Lifting Heavy",
    "Medical Assistance",
    "Animal Care",
    "Construction/Handy/Repair Work",
    "Childcare",
    "Teaching",
    "Coaching",
    "IT Literacy",
    "Coordination",
    "Project Management",
    "Gardening",
    "Public Speaking",
    "Cooking",
    "Cleaning",
    "Art",
    "Music",
];

//list of preferences for preferences dropdown
const preferencesList = [
    "Day",
    "Night",
    "Social",
    "Individual",
    "Small Team Size",
    "Large Team Size",
    "Physical",
    "Sedentary",
    "Indoor",
    "Outdoor",
];

const ProfileManagement = () => {
    const { id } = useParams(); //grab id from url to map to certain user in json
    const [profile, setProfile] = useState(null); //contains profil data

    //for useStates
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [isEditingPreferences, setIsEditingPreferences] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [availability, setAvailability] = useState([]);

    //everytime page renders, set id to id from url to set data,skills,preferences
    useEffect(() => {
        const API_URL = process.env.REACT_APP_API_URL;
        fetch(`${API_URL}/api/profile/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                const formattedAvailability = data.availability //to convert the weird date format seen in the user json to a more readable one
                    ? data.availability.map((dateStr) => new Date(dateStr))
                    : [];
                setProfile({ ...data, availability: formattedAvailability }); //getting data that was fetched and put it into profile obkect
                setAvailability(formattedAvailability);
                setSelectedSkills(data.skills || []);
                setSelectedPreferences(data.preferences || []);
            })
            .catch((error) => console.error("Error fetching profile:", error));
    }, [id]);

    //for whenever dates are added or taken off from the calendar
    const handleDateChange = (date) => {
        if (!isEditingInfo) {
            return; 
        }

        if (date) {
            const isDateSelected = availability.some(
                (existingDate) => existingDate.getTime() === date.getTime()
            );

            if (isDateSelected) {
                setAvailability((prevDates) => { //logic for selecting a date you aready picked
                    const updatedDates = prevDates.filter(
                        (existingDate) =>
                            existingDate.getTime() !== date.getTime()
                    );
                    setProfile((prevProfile) => ({
                        ...prevProfile,//update profile here
                        availability: updatedDates,
                    }));
                    return updatedDates;
                });
            } else {
                //Add new date to array of availability dates
                setAvailability((prevDates) => {
                    const updatedDates = [...prevDates, date];
                    updatedDates.sort((a, b) => a - b);
                    //update profile availability
                    setProfile((prevProfile) => ({
                        ...prevProfile,
                        availability: updatedDates,
                    }));
                    return updatedDates;
                });
            }
        }
    };

    //dealing with adding a skill or removing a skill you already picked
    const handleSkillChange = (event) => {
        const { value, checked } = event.target;
        setSelectedSkills((prevSkills) =>
            checked
                ? [...prevSkills, value]
                : prevSkills.filter((skill) => skill !== value)
        );
    };

    //same functionality as top ubut w/ preferences
    const handlePreferenceChange = (event) => {
        const { value, checked } = event.target;
        setSelectedPreferences((prevPreferences) =>
            checked
                ? [...prevPreferences, value]
                : prevPreferences.filter((preference) => preference !== value)
        );
    };

    const handleConfirmChangesSkillsPrefs = async () => {
        const updatedData = {
            skills: selectedSkills,
            preferences: selectedPreferences,
        };
    
        // Ensure id is available
        if (!id) {
            console.error("User ID is missing");
            return;
        }
    
        try {
            // PUT request to update the profile
            const API_URL = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${API_URL}/api/profile/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedData),
                }
            );
    
            if (response.ok) {
                // Get updated profile after the PUT request is successful
                const updatedProfile = await response.json();
    
                // Merge the updated skills and preferences with the current profile
                const mergedProfile = {
                    ...profile,  // Keep existing profile data
                    skills: updatedProfile.skills,  // Update skills
                    preferences: updatedProfile.preferences,  // Update preferences
                };
    
                // Update the profile state with the merged data
                setProfile(mergedProfile);
    
                // Exit editing mode after a successful update
                setIsEditingSkills(false);
                setIsEditingPreferences(false);
    
                console.log("Profile updated successfully:", mergedProfile);
            } else {
                // Handle API response failure
                const errorMessage = await response.text();
                console.error("Error with updating profile:", errorMessage);
            }
        } catch (error) {
            // Handle network or other errors
            console.error("Error in PUT request:", error);
        }
    };
    

    const handleProfileChange = (e) => {
        const { name, value } = e.target; //Get the name of the input and its value
        //update the certain input
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value, //dybamic so that you can use for any normal text field
        }));
    };

    //For dealing with updating profile info
    const handleProfileSubmit = async (e) => {
        console.log("Profile submit triggered");
        e.preventDefault();

        //Perform the API call to update the profile only if we're in editing mode
        if (isEditingInfo) {
            const updatedProfile = { //this is to make sure no values are null, making the webstie crash
                name: profile.name || "",
                address: profile.address || "",
                address2: profile.address2 || "",
                city: profile.city || "",
                state: profile.state || "",
                zip: profile.zip || "",
                number: profile.number || "",
                emergency: profile.emergency || "",
                email: profile.email || "",
                skills: selectedSkills || [],
                preferences: selectedPreferences || [],
                role: profile.role || "",
                profilePicture: profile.profilePicture || "",
                password: profile.password || "",
                availability: profile.availability || [],
            };
            try {
                const API_URL = process.env.REACT_APP_API_URL;
                const response = await fetch(
                    `${API_URL}/api/profile/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedProfile), //puts updated info in body to send as response
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update profile");
                }

                setProfile(updatedProfile);
                setIsEditingInfo(false);  //get out edit mode
                console.log("Updating profile data...");
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    };

    const handleEditToggle = (e) => {
        //Only toggle edit mode if we are not already submitting the form
        e.preventDefault();
        setIsEditingInfo(!isEditingInfo);
    };

    //gives app time to fetch data (async). Needed bc there is small window when loading page that the attributes are null which will return an error
    if (!profile) {
        return <div> Loading... </div>;
    }

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Information</h1>
            <div className="profile-routing-buttons">
            <Link to={`/user/${id}/events`}>
                <button className="profile-to-history-button">
                    History
                </button>
                </Link>
                <Link to="/notifications/:id">
                    <button className="profile-to-notifications-button">
                        Notifications
                    </button>
                </Link>
            </div>
            
            <div className="profile-header">
                <form
                    className="profile-details"
                    onSubmit={handleProfileSubmit}
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        value={profile.name || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        maxLength="50"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={profile.address || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        maxLength="100"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address 2"
                        name="address2"
                        value={profile.address2 || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        maxLength="100"
                    />
                    <input
                        type="text"
                        placeholder="City"
                        name="city"
                        value={profile.city || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        maxLength="100"
                        required
                    />
                    <select
                        type="text"
                        placeholder="State"
                        name="state"
                        value={profile.state || ""}
                        onChange={handleProfileChange}
                        disabled={!isEditingInfo}
                        className="state-dropdown"
                    >
                        <option value="" disabled>
                            Select a state
                        </option>
                        <option value="AL">AL - Alabama</option>
                        <option value="AK">AK - Alaska</option>
                        <option value="AZ">AZ - Arizona</option>
                        <option value="AR">AR - Arkansas</option>
                        <option value="CA">CA - California</option>
                        <option value="CO">CO - Colorado</option>
                        <option value="CT">CT - Connecticut</option>
                        <option value="DE">DE - Delaware</option>
                        <option value="FL">FL - Florida</option>
                        <option value="GA">GA - Georgia</option>
                        <option value="HI">HI - Hawaii</option>
                        <option value="ID">ID - Idaho</option>
                        <option value="IL">IL - Illinois</option>
                        <option value="IN">IN - Indiana</option>
                        <option value="IA">IA - Iowa</option>
                        <option value="KS">KS - Kansas</option>
                        <option value="KY">KY - Kentucky</option>
                        <option value="LA">LA - Louisiana</option>
                        <option value="ME">ME - Maine</option>
                        <option value="MD">MD - Maryland</option>
                        <option value="MA">MA - Massachusetts</option>
                        <option value="MI">MI - Michigan</option>
                        <option value="MN">MN - Minnesota</option>
                        <option value="MS">MS - Mississippi</option>
                        <option value="MO">MO - Missouri</option>
                        <option value="MT">MT - Montana</option>
                        <option value="NE">NE - Nebraska</option>
                        <option value="NV">NV - Nevada</option>
                        <option value="NH">NH - New Hampshire</option>
                        <option value="NJ">NJ - New Jersey</option>
                        <option value="NM">NM - New Mexico</option>
                        <option value="NY">NY - New York</option>
                        <option value="NC">NC - North Carolina</option>
                        <option value="ND">ND - North Dakota</option>
                        <option value="OH">OH - Ohio</option>
                        <option value="OK">OK - Oklahoma</option>
                        <option value="OR">OR - Oregon</option>
                        <option value="PA">PA - Pennsylvania</option>
                        <option value="RI">RI - Rhode Island</option>
                        <option value="SC">SC - South Carolina</option>
                        <option value="SD">SD - South Dakota</option>
                        <option value="TN">TN - Tennessee</option>
                        <option value="TX">TX - Texas</option>
                        <option value="UT">UT - Utah</option>
                        <option value="VT">VT - Vermont</option>
                        <option value="VA">VA - Virginia</option>
                        <option value="WA">WA - Washington</option>
                        <option value="WV">WV - West Virginia</option>
                        <option value="WI">WI - Wisconsin</option>
                        <option value="WY">WY - Wyoming</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Zip Code"
                        name="zip"
                        value={profile.zip || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        maxLength="9"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Phone Number"
                        name="number"
                        value={profile.number || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Emergency Contact"
                        name="emergency"
                        value={profile.emergency || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={profile.email || ""}
                        onChange={handleProfileChange}
                        readOnly={!isEditingInfo}
                        required
                    />
                    <div className="availability-container">
                        <label htmlFor="availability">
                            Select Availability Dates
                        </label>

                        <DatePicker
                            selected={null}
                            onChange={handleDateChange} //Handle date selection each time one is chosen or unchosen
                            dateFormat="yyyy/MM/dd"
                            placeholderText="Click to select a date"
                            inline
                            shouldCloseOnSelect={false}
                            highlightDates={availability}
                            disabled={!isEditingInfo}
                        />
                        
                        {/*to put range of dates selected unde calendar*/}
                        <div>
                            {availability.length > 0 && (
                                <input
                                    type="text"
                                    readOnly
                                    value={`Dates selected between ${availability[0].toLocaleDateString()} and ${availability[availability.length - 1].toLocaleDateString()}`}
                                    className="date-range-display"
                                />
                            )}
                        </div>
                    </div>

                    {/*Toggle Edit Mode button*/}
                    {isEditingInfo ? (
                        <button type="submit" className="profile-edit-button">
                            Save Changes
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleEditToggle}
                            className="profile-edit-button"
                        >
                            Edit
                        </button>
                    )}
                </form>
            </div>

            <div className="profile-body">
                <div className="skills-section">
                    <label className="skills-label">Skills</label>
                    <div className="skills-display">
                        <textarea
                            value={selectedSkills.join(", ")}
                            placeholder="Select skills"
                            readOnly
                            className="skills-textbox"
                        />
                        <button
                            onClick={() => {
                                if (isEditingSkills) {
                                    handleConfirmChangesSkillsPrefs(); 
                                } else {
                                    setIsEditingSkills(true);
                                }
                            }}
                            className="skills-edit-button"
                        >
                            {isEditingSkills ? "Confirm" : "Edit"}
                        </button>
                    </div>
                    {/*when in edit mode*/}
                    {isEditingSkills && (
                        <div className="skills-dropdown">
                            <div className="skills-list">
                                {skillsList.map((skill) => (
                                    <label key={skill} className="skill-item">
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            checked={selectedSkills.includes(
                                                skill
                                            )}
                                            onChange={handleSkillChange}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="preferences-section">
                    <label className="preferences-label">Preferences</label>
                    <div className="preferences-display">
                        <textarea
                            value={selectedPreferences.join(", ")}
                            placeholder="Select preferences"
                            readOnly
                            className="preferences-textbox"
                        />
                        <button
                            onClick={() => {
                                if (isEditingPreferences) {
                                    handleConfirmChangesSkillsPrefs();
                                } else {
                                    setIsEditingPreferences(true);
                                }
                            }}
                            className="preferences-edit-button"
                        >
                            {isEditingPreferences ? "Confirm" : "Edit"}
                        </button>
                    </div>
                    {/*when in edit mode*/}
                    {isEditingPreferences && (
                        <div className="preferences-dropdown">
                            <div className="preferences-list">
                                {preferencesList.map((preference) => (
                                    <label
                                        key={preference}
                                        className="preference-item"
                                    >
                                        <input
                                            type="checkbox"
                                            value={preference}
                                            checked={selectedPreferences.includes(
                                                preference
                                            )}
                                            onChange={handlePreferenceChange}
                                        />
                                        {preference}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                    
                <div className="stats-section">
                    <h3>Care Count</h3>
                    <p>Total Hours Volunteered: 0</p>
                    <p>Events Attended: 0</p>
                    <p>Organizations Helped: 0</p>
                    <p>People Directly Impacted: 0</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;
