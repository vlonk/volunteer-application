import React, { useState } from "react";
import "../styles/profileStyles.css";
import { Link } from 'react-router-dom';

//list of skills for skills dropdown section
const skillsList = [
  "Teamwork", "Organization", "Lifting Heavy", "Medical Assistance",
  "Animal Care", "Construction/Handy/Repair Work", "Childcare",
  "Teaching", "Coaching", "IT Literacy", "Coordination",
  "Project Management", "Gardening", "Public Speaking",
  "Cooking", "Cleaning", "Art", "Music"
];

//list of preferences for preferences dropdown
const preferencesList = [
  "Day", "Night", "Social", "Individual", "Small Team Size", "Large Team Size",
  "Physical", "Sedentary", "Indoor", "Outdoor"
];

const ProfileManagement = () => {
  //for useStates
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  //States for profile information
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState("");

  //function for adding skills to your profile
  const handleSkillChange = (event) => {
    const { value, checked } = event.target;
    setSelectedSkills(prevSkills =>
      checked ? [...prevSkills, value] : prevSkills.filter(skill => skill !== value)
    );
  };

  //function for adding preferences to your profile
  const handlePreferenceChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPreferences(prevPreferences =>
      checked ? [...prevPreferences, value] : prevPreferences.filter(preference => preference !== value)
    );    
  }

  //logic for uploading image to profile
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //For dealing with updating profile info
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditingInfo(false);
  };

  return (
 
    <div className="profile-container">
      <h1 className="profile-header">Profile Information</h1>
      <div className="profile-routing-buttons">
        <Link to = "/history">
          <button className="profile-to-history-button">History</button>
        </Link>
        <Link to="/notifications">
          <button className="profile-to-notifications-button">Notifications</button>
        </Link>
      </div>

      <div className="profile-header">

        <div className="profile-pic-section">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-pic" />
            ) : (
              <p className="upload-placeholder">Upload Image</p>
            )}
            <input type="file" accept="image/*" className="profile-upload" onChange={handleImageUpload} />
        </div>

          <form className="profile-details" onSubmit={handleProfileSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={e => setState(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={e => setZipCode(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="text"
              placeholder="Emergency Contact"
              value={emergencyContact}
              onChange={e => setEmergencyContact(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              readOnly={!isEditingInfo}
            />
            <input
              type="date"
              placeholder="Availability"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              readOnly={!isEditingInfo}
            />


            <button 
              type="button" 
              onClick={() => setIsEditingInfo(prevState => !prevState)} 
              className="profile-edit-button">
              {isEditingInfo ? "Confirm" : "Edit"}
            </button>
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
          <button onClick={() => setIsEditingSkills(!isEditingSkills)} className="skills-edit-button">
            {isEditingSkills ? "Confirm" : "Edit"}
          </button>
          </div>

          {isEditingSkills && (
            <div className="skills-dropdown">
              <div className="skills-list">
                {skillsList.map(skill => (
                  <label key={skill} className="skill-item">
                    <input 
                      type="checkbox" 
                      value={skill} 
                      checked={selectedSkills.includes(skill)}
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
            <button onClick={() => setIsEditingPreferences(!isEditingPreferences)} className="preferences-edit-button">
              {isEditingPreferences ? "Confirm" : "Edit"}
            </button>
          </div>

          {isEditingPreferences && (
            <div className="preferences-dropdown">
              <div className="preferences-list">
                {preferencesList.map(preference => (
                  <label key={preference} className="preference-item">
                    <input 
                      type="checkbox" 
                      value={preference} 
                      checked={selectedPreferences.includes(preference)}
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
