import React, { useState, useEffect } from "react";
import "../styles/events_management.css";
import "../styles/profileStyles.css";

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

///// list of skills for skills dropdown section




//////// EVENTS CREATION

const EventCreation = ({ closeEventCreation, onCreateEvent }) => {  // onCreateEvent added for the backend integration
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [urgency, setUrgency] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [isVisible, setIsVisible] = useState(false); // state to toggle skill visibility

  const skillsList = [  // same skill list as profiles
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

    // Handle checkbox change to update selected skills
    const handleSkillChange = (skill) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
        );
    };

    const handleToggleVisibility = () => {
        setIsVisible((prev) => !prev); // toggling visibility on click
    };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!title || !description || !date || !urgency || !number || !email || selectedSkills.length === 0) {
        throw new Error("Please fill in all sections to create event.");
      }

      const newEvent = {
        title,
        description,
        date,
        urgency,
        number,
        email,
        selectedSkills,
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
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
            {/* the button to toggle the skills dropdown visibility */}
        <label>
          <div onClick={handleToggleVisibility} className="skills-toggle-button">
            {isVisible ? 'Hide Skills' : 'Show Skills:'}
          </div>
        </label>

            {/* Show this content only if isVisible is true */}
            {isVisible && (
                <div className="skills-container">
                    <div className="skills-list">
                        {skillsList.map((skill) => (
                            <label key={skill} className="skill-item">
                                <input
                                    type="checkbox"
                                    value={skill}
                                    checked={selectedSkills.includes(skill)} // check if the skill is selected
                                    onChange={() => handleSkillChange(skill)} // handle checkbox change
                                />
                                {skill}
                            </label>
                        ))}
                    </div>
                    
                </div>
            )}
            {selectedSkills.length >= 0 && (
                <div>
                    <h4>Selected Skills:</h4>
                    <ul>
                        {selectedSkills.map((skill) => (
                            <li key={skill}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}
            
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
  const [number, setNumber] = useState(event.number);
  const [email, setEmail] = useState(event.email);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!title || !description || !date || !urgency || !skills || !number || !email) {
        throw new Error("Please fill in all sections to edit event.");
      }

      const updatedEvent = {
        ...event, // grabbing the info of the specified event
        title,
        description,
        date,
        urgency,
        skills,
        number,
        email
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
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

const DropdownMenu = ({title, options, onSelect, selectedItem}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen); // toggles the dropdown open and closed
    };
  
    const handleSelect = (option) => {
      onSelect(option);
      setIsOpen(false);
    }

    return (
      <div className="dropdown">
        <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedItem ? (selectedItem.name || selectedItem.title) : title}  {/* this keeps the option picked on the button for both user and event */}
        </button>
        {isOpen && (
          <div className="dropdown-content">
            {options.length > 0 ? (
            options.map((option) => (
              <button key={option.id} onClick={() => handleSelect(option)}>
                {option.name || option.title}
              </button>
            ))):(
              <p>No options available</p>
          )}
          </div>
        )}
      </div>
    );
  };


///// VOLUNTEER MATCHUPS



///// EVENTS MANAGEMENT

const EventsManagement = () => {
  const [showEventCreation, setShowEventCreation] = useState(false);  // box expansions
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);  // tracks the event editting
  const [users, setUsers] = useState([]);  // using this for volunteers
  const [matchingEvents, setMatchingEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [history, setHistory] = useState([]);


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

    // fetch users from backend, we need to get their name and skills for the volunteer matching
    useEffect(() => {
      fetch("http://localhost:4000/api/profiles")
        .then(response => response.json())
        .then(data => {
          console.log("Fetched users:", data); // checking data struct
          // since we are using json its an object, we need an array
          const usersArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
        setUsers(usersArray); // set the state with the events array
        })
        .catch(error => console.error("Error fetching users:", error));
    }, []);  
  
    // fetch matching events based on the user's skills
    useEffect(() => {
      if (selectedUser) {
        // Assuming `selectedUser.skills` contains the skills to match with events
        const matching = events.filter(event => 
          event.skills.split(",").some(skill => selectedUser.skills.includes(skill))
        );
        setMatchingEvents(matching);
      }
    }, [selectedUser, events]);
  
    // reset selectedEvent when selectedUser changes
    useEffect(() => {
    setSelectedEvent(null); // clear the selected event when user changes
    }, [selectedUser]);  // runs when selectedUser changes

    // fetching history to find match with user
    useEffect(() => {
      if (selectedUser) { 
        fetch(`http://localhost:4000/api/user/${selectedUser.id}/events`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Failed to fetch event history");
            }
            return response.json();
          })
          .then(data => {
            setHistory(data);
          })
          .catch(error => console.error("Error fetching event history:", error));
      }
    }, [selectedUser]);

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

  const confirmVolunteer = () => {
    if (!selectedUser || !selectedEvent) {
      alert("Please select a user and event.");
      return;
    }
  
    const updatedHistory = [
      ...(history[`history_${selectedUser.id}`] || []),
      {
        eventId: selectedEvent.id,
        name: selectedEvent.title,
        dateAttended: new Date().toISOString(),
        location: selectedEvent.location,
        description: selectedEvent.description,
        urgency: selectedEvent.urgency,
        skills: selectedEvent.skills,
        status: "Pending",
      },
    ];
  
    // 1️⃣ Updating user's event history
    fetch(`http://localhost:4000/api/user/${selectedUser.id}/events`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedHistory),
    })
      .then((response) => response.json())
      .then((updatedUserHistory) => {
        console.log("User's history updated:", updatedUserHistory);
        setHistory((prevHistory) => ({
          ...prevHistory,
          [`history_${selectedUser.id}`]: updatedUserHistory,
        }));
      })
      .catch((error) => {
        console.error("Error updating user history:", error);
      });
  
    // 2️⃣ Updating the event to track the volunteer
    fetch(`http://localhost:4000/api/events/${selectedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...selectedEvent,
        volunteerId: selectedUser.id, // Assigning user to event
      }),
    })
      .then((response) => response.json())
      .then((updatedEvent) => {
        console.log("Event updated:", updatedEvent);
        setSelectedEvent(updatedEvent); // Update state
        alert("Volunteer confirmed!");
  
        setTimeout(() => {
          window.alert(""); // Clear alert after 2 seconds
        }, 2000);
  
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
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
        </div>
    </div>

  {/* VOLUNTEER MATCHING STARTS HERE*/}

    <div className = "half-container"> 
        <div className="create-box">
            <button> Volunteer Matching</button>
        </div>
        <div className = "volunteer-menu">           
        <DropdownMenu
            title={selectedUser ? selectedUser.name : "Choose a Volunteer"}
            options={users}
            onSelect={setSelectedUser} // updates the selected user
            selectedItem= {selectedUser}
          />
          {selectedUser && (
            <DropdownMenu
              title="Choose From Matching Events"
              options={matchingEvents}
              onSelect={(event) => setSelectedEvent(event)}
              selectedItem={selectedEvent}
            />
          )}
            <div className = "dropdown-match-box">
                <div className = "dropdown-match-message">
                    <h3>Assigning Volunteer to Event</h3>
                </div>
                <button onClick={confirmVolunteer}>
                Confirm
                </button>
            </div>
        </div>



    </div>

  </div>
  );
};

export default EventsManagement;
