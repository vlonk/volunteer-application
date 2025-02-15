import React, { useState } from "react";
import "../styles/events_management.css";

//////  EXPANDING BOXES

const ExpandBoxEm = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const stopPropagation = (event) => {
    event.stopPropagation(); // prevents box expansion when clicking the buttons
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    const confirm = window.confirm("Are you sure you want to delete this event? This cannot be undone.");
    if (confirm) {
      console.log("Event deleted.");
    }
  };

  return (
    <div className={`expandable-box-em ${isExpanded ? "expanded" : ""}`} onClick={handleClick}>
      <div className="expandable-box-em-left">
        <h3>{title}</h3>
        {isExpanded && <p>{content}</p>}
      </div>
      <div className="expandable-box-em-right">
        <button onClick={stopPropagation}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

//////// EVENTS CREATION

const EventCreation = ({ closeEventCreation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [urgency, setUrgency] = useState('');
  const [skills, setSkills] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!title || !description || !date || !urgency || !skills || !contactInfo) {
        throw new Error("Please fill in all sections to create event.");
      }

      // If everything is valid, simulate form submission
      console.log("Event created successfully.");

      setShowPopup(true);

      setTimeout(() => {
        closeEventCreation();
      }, 2000); 

    } catch (err) {
      window.alert("Please fill in all sections to create event.");
      return;
    }
  };

  const closePopup = () => {
    setShowPopup(false); // close the popup when the user clicks 'Close'
  };

  return (
    <div className="creation-container">
      <form onSubmit={handleSubmit}>
        <h1>Event creation:</h1>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="urgency">Urgency:</label>
          <input
            type="text"
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="skills">Skills:</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contactInfo">Contact Info:</label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">Create</button>
      </form>

      {/* popup for event creation confirmation */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
          <button className="close-button-top" onClick={closePopup}> × </button>

            <h2>Confirmed!</h2>
            <p>Your event has been successfully created.</p>
            <button className="close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

/////// DROP DOWN MENU FOR VOLUNTEERS

const DropdownMenu = ({title}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen); // toggles the dropdown open and closed
    };
  
    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {title}
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <a href="#">Option 1</a>
            <a href="#">Option 2</a>
            <a href="#">Option 3</a>
          </div>
        )}
      </div>
    );
  };

///// EVENTS MANAGEMENT

const EventsManagement = () => {
  const [showEventCreation, setShowEventCreation] = useState(false);

  return (
    <div className = "central-container">
        <div className="half-container">
            <div className="create-box">
                <button onClick={() => setShowEventCreation(true)}>
                    Create Event
                </button>
            </div>  

            {showEventCreation && (
            <div className="popup-overlay">
                <EventCreation closeEventCreation={() => setShowEventCreation(false)} />
            </div>
        )}

        <div className="em-listing">
            <ExpandBoxEm title="Event: Blood Drive Volunteers" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Food Bank" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Animal Search and Rescue" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: School Safety and Awareness" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Soup Kitchen Volunteers" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
        </div>
    </div>

{/* VOLUNTEER MATCHING STARTS HERE*/}

    <div className = "half-container"> 
        <div className="create-box">
            <button> Volunteer Matching</button>
        </div>
        <div className = "volunteer-menu">           
            <DropdownMenu title = "Choose a Volunteer"/>
            <DropdownMenu title = "Choose From Matching Events"/>
            <div className = "dropdown-match-box">
                <div className = "dropdown-match-message">
                    <h3>Assigning Volunteer to Event</h3>
                </div>
                <button>
                Confirm
                </button>
            </div>
        </div>



    </div>

</div>
  );
};

export default EventsManagement;
