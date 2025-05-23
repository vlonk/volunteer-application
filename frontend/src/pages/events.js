import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/events.css";

const ExpandBox = ({ title, content, eventId, loggedIn }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasSignedUp, setHasSignedUp] = useState(false);
    const [showLoginMessage, setShowLoginMessage] = useState(false);
      //const [history, setHistory] = useState([]);   // added for sign up button functionality

    useEffect(() => {
        if (loggedIn) {
            setShowLoginMessage(false); // Remove login message when user logs in
        }
    }, [loggedIn]);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSignUp = async (e) => {
        e.stopPropagation(); // Prevent closing the box when clicking sign-up
    
        if (!loggedIn) {
            setShowLoginMessage(true); // Show login message if not logged in
            return;
        }
    
        // Ask for confirmation
        if (window.confirm("Are you sure you want to sign up for this event?")) {
            setHasSignedUp(true); // Mark the user as signed up
    
            // Get userId from localStorage (you should store it when the user logs in)
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("User ID not found in localStorage.");
                return;
            }
    
            // Generate notificationId - make sure it's a string, e.g., unique identifier or use a random ID
            const notificationId = `notif-${new Date().getTime()}`;  // Using timestamp for uniqueness
    
            const message = "Your participation in this event is pending. Make sure to check the details!";
            const timestamp = new Date();  // Timestamp when the notification was created
            const status = "Unread";  // Status of the notification
    
            // Request body
            const requestBody = {
                notificationid: notificationId,  // Unique notification ID (string)
                eventid: eventId,  // Event ID (example here, adjust as necessary)
                userid: userId,  // User ID from localStorage
                message: message,  // Notification message
                status: status,  // Status of the notification
                timestamp: timestamp,  // Timestamp when the notification was created
            };
    
            console.log("Sending notification with body:", requestBody);  // Log request body
    
            try {
                const API_URL = process.env.REACT_APP_API_URL;
                const response = await fetch(`${API_URL}/api/notification/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });
    
                const data = await response.json();
                console.log('Notification sent:', data);
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        
            // updating event after volunteer sign up
            const confirmVolunteer = async (userId, eventId) => {
                const API_URL = process.env.REACT_APP_API_URL;
              
                try {
                  // fetching the selected event and user
                  const [eventRes, userRes] = await Promise.all([
                    fetch(`${API_URL}/api/events/${eventId}`),
                    fetch(`${API_URL}/api/profile/${userId}`)
                  ]);
              
                  if (!eventRes.ok || !userRes.ok) throw new Error("Failed to fetch event or user");
              
                  const selectedEvent = await eventRes.json();
                  const selectedUser = await userRes.json();
              
                  // updating the event's volunteer list
                  const updatedVolunteers = [
                    ...selectedEvent.volunteersList,
                    {
                      id: selectedUser.id,
                      name: selectedUser.name,
                      assignment: "General help"
                    }
                  ];
              
                  const updateRes = await fetch(`${API_URL}/api/events/${selectedEvent._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ volunteersList: updatedVolunteers }),
                  });
              
                  if (!updateRes.ok) throw new Error("Failed to update event");
              
                  const updatedEvent = await updateRes.json();
                  console.log("Event updated:", updatedEvent);
                  alert("Volunteer confirmed!");
                } catch (error) {
                  console.error("Error confirming volunteer:", error);
                }
              };
              await confirmVolunteer(userId, eventId);
              

    }
};
    
    
    

    return (
        <div className={`expandable-box ${isExpanded ? "expanded" : ""}`} onClick={handleClick}>
            <h3>{title}</h3>

            {isExpanded && (
                <>
                    {title !== "Event: No events available" && !hasSignedUp ? ( // this is so the sign up button shows up when there is actually an event not signed up for
                        <div className="sign-up">
                            <button onClick={handleSignUp}>Sign Up</button>
                        </div>
                        ) : title !== "Event: No events available" && hasSignedUp ? (   // this for an event that has been signed up for
                            <p className="message-signed-up">You've signed up for this event!</p>
                        ) : null    // sign up won't show up when there are no events to sign up for
                    }

                    {showLoginMessage && <p className="message-login-required">You must be logged in to sign up.</p>}
                    <p>{content}</p>
                </>
            )}
        </div>
    );
};

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [listing, setListing] = useState("all");  // this is added to make the listing of events change between all events and matching events for the user
    const userId = localStorage.getItem("userId");  // we have the userId in local storage since its stored when handling the sign in
    const [loggedIn, setLoggedIn] = useState(false);


    // fetching events based on the listing choice
    useEffect(() => {
        const fetchEvents = async () => {
            const API_URL = process.env.REACT_APP_API_URL;
            const endpoint = 
                listing === "matching"
                ? `${API_URL}/api/matching-events/${userId}`
                : `${API_URL}/api/all-events`;

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                let eventsArray = Array.isArray(data) ? data : [];

                  if (eventsArray.length === 0) {
                    eventsArray = [{
                        id: "no-events",
                        title: "No events available",
                        description: "There are currently no events to display. Please check back later!"
                    }];
                }
                  
                  setEvents(eventsArray); // set the state with the events array
            }
            catch (error){
                console.error("error fetching events: ", error);
            }
        }
        fetchEvents();
    }, [listing, userId])

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken");
            setLoggedIn(!!token);
            console.log("Log in status: ", loggedIn);
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, [loggedIn]);

    return (
        <div>
            <div className="events-listing-spacer">
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button onClick={() => setListing("all")}>All Events</button>
                <button onClick={() => setListing("matching")}>Matching Events</button>
        </div>
            </div>

            <div className="events-listing">
                {events.map((event) =>(
                    <ExpandBox
                    key = {event.id}
                    title = {`Event: ${event.title}`}
                    content = {`Info: ${event.description}`}
                    eventId = {event._id}    // thinking of using this for the sign up button
                    loggedIn
                    />
                    
                ))}
            </div>

            <div className="events-return-home">
                <button onClick={() => navigate("/home")}>Home</button>
            </div>
        </div>
    );
};

export default Events;
