import React, { useState, useEffect } from "react";
import "../styles/profileStyles.css";
import { Link, useParams } from 'react-router-dom';

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
  //what id are we looking at?
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  //for useStates
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);


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

  const handleConfirmChanges = async () => {  
    const updatedData = {
      skills: selectedSkills,
      preferences: selectedPreferences,
    };

    try {
      // Send the updated data to the backend using PUT request
      const response = await fetch(`http://localhost:4000/api/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // Send updated skills and preferences
      });

      if (response.ok) {
        // Handle success (e.g., update the state, show a success message)
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditingSkills(false);
        setIsEditingPreferences(false);
      } else {
        // Handle failure (e.g., show an error message)
        console.error('Error updating profile:', await response.text());
      }
    } catch (error) {
      console.error('Error in PUT request:', error);
    }
  };

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

  

  useEffect(() => {
    fetch(`http://localhost:4000/api/profile/${id}`)
      .then(response => response.json())
      .then(data => {
        setProfile(data);
        setSelectedSkills(data.skills || []);
        setSelectedPreferences(data.preferences || []);
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, [id]);

  //gives app time to fetch data (async). Needed bc there is small window when loading page that the attributes are null which will return an error
  if (!profile) {
    return <div> Loading... </div>;
  }

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
        value={profile.name}
        onChange={e => setProfile({ ...profile, name: e.target.value })}
        readOnly={!isEditingInfo}
        maxLength="50"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={profile.address}
        onChange={e => setProfile({ ...profile, address: e.target.value })}
        readOnly={!isEditingInfo}
        maxLength="100"
        required
      />
      <input
        type="text"
        placeholder="Address 2"
        value={profile.address2}
        onChange={e => setProfile({ ...profile, address2: e.target.value })}
        readOnly={!isEditingInfo}
        maxLength="100"
      />
      <input
        type="text"
        placeholder="City"
        value={profile.city}
        onChange={e => setProfile({ ...profile, city: e.target.value })}
        readOnly={!isEditingInfo}
        maxLength="100"
        required
      />
      <input
        type="text"
        placeholder="State"
        value={profile.state}
        onChange={e => setProfile({ ...profile, state: e.target.value })}
        readOnly={!isEditingInfo}
      />
      <input
        type="text"
        placeholder="Zip Code"
        value={profile.zip}
        onChange={e => setProfile({ ...profile, zip: e.target.value })}
        readOnly={!isEditingInfo}
        maxLength="9"
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={profile.number}
        onChange={e => setProfile({ ...profile, number: e.target.value })}
        readOnly={!isEditingInfo}
      />
      <input
        type="text"
        placeholder="Emergency Contact"
        value={profile.emergencyContact}
        onChange={e => setProfile({ ...profile, emergencyContact: e.target.value })}
        readOnly={!isEditingInfo}
      />
      <input
        type="email"
        placeholder="Email"
        value={profile.email}
        onChange={e => setProfile({ ...profile, email: e.target.value })}
        readOnly={!isEditingInfo}
      />
      <input
        type="date"
        placeholder="Availability"
        value={profile.availability}
        onChange={e => setProfile({ ...profile, availability: e.target.value })}
        readOnly={!isEditingInfo}
      />

      {/* Toggle Edit Mode */}
      {isEditingInfo ? (
        <button type="submit" className="profile-edit-button">
          Save Changes
        </button>
      ) : (
        <button 
          type="button" 
          onClick={() => setIsEditingInfo(true)} 
          className="profile-edit-button">
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
                handleConfirmChanges(); // Confirm changes when editing
              } else {
                setIsEditingSkills(true); // Toggle to editing state
              }
            }} 
            className="skills-edit-button"
          >
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
          <button 
            onClick={() => {
              if (isEditingPreferences) {
                handleConfirmChanges(); // Confirm changes when editing
              } else {
                setIsEditingPreferences(true); // Toggle to editing state
              }
            }} 
            className="preferences-edit-button"
          >
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
