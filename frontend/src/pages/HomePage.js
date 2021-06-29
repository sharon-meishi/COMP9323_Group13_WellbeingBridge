import React from 'react';
import NavBar from "../components/NavBar";
import NewsCarousel from '../components/HomePage/NewsCarousel'
import OrganizationAllType from '../components/HomePage/OrganizationAllType'
import CardBoard from '../components/HomePage/CardBoard';

function HomePage() {

  return (
    <div>
      <NavBar/>
      <NewsCarousel />
      <OrganizationAllType/>
      <CardBoard />
    </div>
  )
}

export default HomePage
