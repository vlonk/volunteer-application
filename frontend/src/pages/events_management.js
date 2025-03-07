import React, { useState, useEffect } from "react";
import "../styles/events_management.css";

//////  EXPANDING BOXES

const ExpandBoxEm = ({ title, content, id, onDelete, onEdit }) => { // id, onEdit and onDelete have been added here as part of the backend
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };


  const handleDelete = (event) => {
    event.stopPropagation();
    const confirm = window.confirm("Are you sure you want to delete this event? This cannot be undone.");
    if (confirm) {
      console.log("Event deleted.");
      onDelete(id); // calling onDelete for backend, this is provided in the EventsManagement when the boxes appear
    }
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    console.log("Editing event.");
    onEdit(id); // calling the onEdit function with the event ID
  };

  return (
    <div className={`expandable-box-em ${isExpanded ? "expanded" : ""}`} onClick={handleClick}>
      <div className="expandable-box-em-left">
        <h3>{title}</h3>
        {isExpanded && <p>{content}</p>}
      </div>
      <div className="expandable-box-em-right">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

//////// EVENTS CREATION

const EventCreation = ({ closeEventCreation, onCreateEvent }) => {  // onCreateEvent added for the backend integration
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

      const newEvent = {
        title,
        description,
        date,
        urgency,
        skills,
        contactInfo
      }
      

      // if everything is valid, simulate form submission
      console.log("Event created successfully.");

      setShowPopup(true);

      setTimeout(() => {
        closeEventCreation();
      }, 2000); 

      // we pass this to the Events Management to do backend work
      onCreateEvent(newEvent);

    } catch (err) {
      window.alert("Please fill in all sections to create event.");
      return;
    }
  };

  const closeForm = (e) => {  // added this to close out form without submit
    e.preventDefault(); // prevents form submission
    closeEventCreation();
  };

  return (
    <div className="creation-container">

      <form onSubmit={handleSubmit}>
      <button className="close-button" onClick={closeForm}>Close</button>

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

            <h2>Confirmed!</h2>
            <p>Your event has been successfully created.</p>
          </div>
        </div>
      )}
    </div>
  );
};

/////// EVENTS EDITTING

const EventEdit = ({ event, closeEventEdit, onEditEvent }) => { // altered from the event creation
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [urgency, setUrgency] = useState(event.urgency);
  const [skills, setSkills] = useState(event.skills);
  const [contactInfo, setContactInfo] = useState(event.contactInfo);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!title || !description || !date || !urgency || !skills || !contactInfo) {
        throw new Error("Please fill in all sections to edit event.");
      }

      const updatedEvent = {
        ...event, // grabbing the info of the specified event
        title,
        description,
        date,
        urgency,
        skills,
        contactInfo
      };

      // passing the updated event to the parent
      onEditEvent(updatedEvent);

      console.log("Event edited successfully.");

      setShowPopup(true);

      setTimeout(() => {
        closeEventEdit();
      }, 2000);

    } catch (err) {
      window.alert("Please fill in all sections to edit event.");
      return;
    }
  };

  const closeForm = (e) => {
    e.preventDefault();
    closeEventEdit();
  };

  return (
    <div className="creation-container">
      <form onSubmit={handleSubmit}>
        <button className="close-button" onClick={closeForm}>Close</button>

        <h1>Edit Event:</h1>

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

        <button type="submit" className="signup-button">Save Changes</button>
      </form>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Confirmed!</h2>
            <p>Your event has been successfully updated.</p>
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
            <button>Option 1</button>
            <button>Option 2</button>
            <button>Option 3</button>
          </div>
        )}
      </div>
    );
  };

///// EVENTS MANAGEMENT

const EventsManagement = () => {
  const [showEventCreation, setShowEventCreation] = useState(false);  // box expansions
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);  // tracks the event editting


  // fetch events from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched events:", data); // checking data struct
        // since we are using json its an object, we need an array
        const eventsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      setEvents(eventsArray); // set the state with the events array
      })
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  const handleCreateEvent = (newEvent) => {
    fetch("http://localhost:4000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent), // sending the event data without `id`
    })
      .then(response => response.json())
      .then(data => {
        // backend should have generated `id`
        setEvents(prevEvents => [...prevEvents, data]); // adding new event to the list
        setShowEventCreation(false);
        window.location.reload(); // refreshing the list  
      })

      .catch(error => console.error("Error creating event:", error));
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const response = await fetch(`http://localhost:4000/api/events/${updatedEvent.id}`, { // fetching event based on given id
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        setEditEvent(null); // closing form and refreshing
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // function to delete event via backend
  const handleDeleteEvent = (id) => {
    fetch(`http://localhost:4000/api/events/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        } else {
          console.error("Failed to delete event");
        }
      })
      .catch(error => console.error("Error deleting event:", error));
  };

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
                <EventCreation closeEventCreation={() => setShowEventCreation(false)}
                onCreateEvent = {handleCreateEvent} // passing function to EventCreation
                />
            </div>
        )}

        <div className="em-listing">
          {events.map((event) => (
            <ExpandBoxEm
            key = {event.id}
            title = {event.title}
            content = {`Info: ${event.description}`}
            id = {event.id} // after fetching events from backend we get the id to work with the edit and delete buttons
            onDelete = {handleDeleteEvent}  // passing delete functionality to the box component
            onEdit = {() => setEditEvent(event)}
            />
          ))}

          {/* THIS SEGMENT REFERS TO THE EDIT, SHOWS UP ONLY WHEN EDIT BUTTON IS CLICKED */}
          {editEvent && (
          <div className="popup-overlay">
          <EventEdit 
            event={editEvent} 
            closeEventEdit={() => setEditEvent(null)} 
            onEditEvent={handleEditEvent} 
          />
        </div>
    )}
          {/*
            <ExpandBoxEm title="Event: Blood Drive Volunteers" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Food Bank" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Animal Search and Rescue" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: School Safety and Awareness" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            <ExpandBoxEm title="Event: Soup Kitchen Volunteers" content="Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals." />
            */}
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
