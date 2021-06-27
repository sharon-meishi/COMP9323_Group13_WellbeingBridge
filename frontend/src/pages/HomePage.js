import React from 'react';
import NavBar from "../components/NavBar";
import NewsCarousel from '../components/HomePage/NewsCarousel'
import OrganizationAllType from '../components/HomePage/OrganizationAllType'
import EventCard from '../components/EventCard';

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
      HomePage
      <NavBar/>
      <NewsCarousel />
      <OrganizationAllType/>
      <EventCard info = {mock_eventcard_info}/>
    </div>
  )
}

export default HomePage
