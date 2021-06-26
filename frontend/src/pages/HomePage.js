import React from 'react';
import EventCard from '../components/EventCard';
import NewsCarousel from '../components/HomePage/NewsCarousel'
import OrganizationAllType from '../components/HomePage/OrganizationAllType'
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
      <NewsCarousel />
      <OrganizationAllType/>
      <EventCard info = {mock_eventcard_info}></EventCard>
    </div>
  )
}

export default HomePage
