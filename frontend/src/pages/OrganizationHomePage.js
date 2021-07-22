import React from 'react';
import BackToTop from '../components/BackToTop';
import NavBar from '../components/NavigationBar/NavBar';
import ScrollspyContent from '../components/OrganizationPage/ScrollspyContent';

function OrganizationHomePage() {
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      <ScrollspyContent />
    </>
  );
}

export default OrganizationHomePage;
