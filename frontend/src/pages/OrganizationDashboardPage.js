import React from 'react';
import NavBar from '../components/NavBar'
import BackToTop from '../components/BackToTop';
import VerticalTab from '../components/OrganizationPage/VerticalTab'

function OrganizationDashboardPage() {
  return (
    <>
    <BackToTop showBelow={250} />
    <NavBar/>
    <VerticalTab/>
    </>
  );
}

export default OrganizationDashboardPage;
