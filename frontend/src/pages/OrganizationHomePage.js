import React from 'react';
import BackToTop from '../components/BackToTop';
import NavBar from '../components/NavigationBar/NavBar';
import ScrollspyContent from '../components/OrganizationPage/ScrollspyContent';

function OrganizationHomePage(props) {
  const oId = props.match.params.oId;
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      <ScrollspyContent oId={oId}/>
    </>
  );
}

export default OrganizationHomePage;
