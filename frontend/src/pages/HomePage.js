import React from 'react';
import NavBar from "../components/NavBar";
import NewsCarousel from '../components/HomePage/NewsCarousel'
import OrganizationAllType from '../components/HomePage/OrganizationAllType'
import EventCard from '../components/EventCard';

function HomePage() {

  return (
    <div>
      <NavBar/>
      <NewsCarousel />
      <OrganizationAllType/>
      <EventCard />
    </div>
  )
}

export default HomePage
