import React from 'react';
import BackToTop from '../components/Public/BackToTop';
import NavBar from '../components/NavigationBar/NavBar';
import ScrollspyContent from '../components/OrganizationPage/ScrollspyContent';
import BottomBar from '../components/Public/BottomBar'

function OrganizationHomePage(props) {
  const oId = props.match.params.oId;
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      <ScrollspyContent oId={oId}/>
      <BottomBar/>
    </>
  );
}

export default OrganizationHomePage;
