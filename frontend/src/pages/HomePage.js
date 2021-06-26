import React from 'react';
import EventCard from '../components/EventCard';
import NavBar from "../components/NavBar";
function HomePage() {
  let mock_eventcard_info = {
    "id": '123',
    "Event name": "string",
    "Location": "string",
    "Date": "2021-06-25T11:27:02.565Z",
    "status": "Ongoing",
    "Details": "string"
  }
  return (
    <div>
        <NavBar/>
        <EventCard info = {mock_eventcard_info}/>
    </div>
  )
}

export default HomePage
