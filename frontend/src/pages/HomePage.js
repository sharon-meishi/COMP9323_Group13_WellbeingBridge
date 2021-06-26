import React from 'react';
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
      Homepage
      <EventCard info = {mock_eventcard_info}></EventCard>
    </div>
  )
}

export default HomePage
