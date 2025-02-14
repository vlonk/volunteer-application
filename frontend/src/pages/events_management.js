import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/events_management.css";
//import {ExpandBox} from "../pages/events.js";

const ExpandBoxEm = ({title, content}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    }

    const stopPropagation = (event) => { //prevents box expansion when clicking the buttons
        event.stopPropagation();
    }

    const handleDelete = (event) => {

        event.stopPropagation();
        const confirm = window.confirm("Are you sure you want to delete this event? This cannot be undone.")
        if (confirm){
            console.log("Event deleted.")
        }
    };

    return(
        <div className = {`expandable-box-em ${isExpanded ? "expanded" : ""}`} onClick = {handleClick}>
            <div className = "expandable-box-em-left">
            <hm>{title}</hm>   
            {isExpanded && <p>{content}</p>}
            </div>
            <div className = "expandable-box-em-right">
                <button onClick={stopPropagation}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}


const EventsManagement = () => {

    const navigate = useNavigate();

    return(

        <div className = "central-container">
            <div className = "create-box">
                <button>
                    Create Event
                </button>
            </div>
            <div className = "em-listing">
                <ExpandBoxEm title = "Event: Blood Drive Volunteers" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
                <ExpandBoxEm title = "Event: Food Bank" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
                <ExpandBoxEm title = "Event: Animal Search and Rescue" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
                <ExpandBoxEm title = "Event: School Safety and Awareness" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
                <ExpandBoxEm title = "Event: Soup Kitchen Volunteers" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
            </div>


        </div>

    );

};

export default EventsManagement;