import React from 'react';
import NavBar from '../components/NavigationBar/NavBar';
import NewsCarousel from '../components/HomePage/NewsCarousel';
import BackToTop from '../components/BackToTop';
import OrganizationAllType from '../components/HomePage/OrganizationAllType';
import CardBoard from '../components/HomePage/CardBoard';

function HomePage() {
  return (
    <>
       <BackToTop showBelow={250} />
      <NavBar />
      <NewsCarousel />
      <OrganizationAllType />
      <CardBoard />
    </>
  );
}

export default HomePage;
