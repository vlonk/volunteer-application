import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/events.css";
import kiWe from "../assets/kiWe.png";

const SearchBar = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className = "events-searchbar">
            <input
            type = "text"
            value = {searchTerm}
            onChange = {handleInputChange}
            placeholder="Search...">
            </input>

            <button onClick = {handleSearch}>Search</button>
        </div>
    )
}

const ExpandBox = ({title, content}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
    }

    return(
        <div className = {`expandable-box ${isExpanded ? "expanded" : ""}`} onClick = {handleClick}>
            <div className = "sign-up">
                <button>sign up</button>
            </div>
            <h3>{title}</h3>
            
            {isExpanded && <p>{content}</p>}
            
        </div>
    )
}



const Event = () => {

    const navigate = useNavigate();
    const handleSearch = (query) =>{
        console.log("Searching for: ", query)
    }


    return (
        <div>
            <div className = "events-header">
                <div className = "events-header-circle">
                    <div className = "events-header-logo">
                        <img src = {kiWe} alt = ""/>
                    </div>
                </div>
            </div>

            <div className = "events-search-spacer"></div>

            <div className = "events-searchbar">
                    <SearchBar onSearch = {handleSearch}/>
            </div>
            <div className = "events-listing">
                <ExpandBox title = "Event: Blood Drive Volunteers" content = "Info: In need of volunteers to aid staff in organizing blood drive for the city hospitals."/>
                <ExpandBox title = "Event: Food Bank Non-Profit" content = "Info: Local non-profit in need of people willing to help in moving food boxes and handing out food items to people in need."/>
            </div>

            <div className="events-home-button">   

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

            </div>
        </div>
    );
};

export default Event;