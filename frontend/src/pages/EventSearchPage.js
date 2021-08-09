import React from 'react';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/Public/BackToTop';
import EventSearch from '../components/SearchPage/EventSearch'
import BottomBar from '../components/Public/BottomBar'

function EventSearchPage() {
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar search={true}/>
      <EventSearch/>
      <BottomBar/>
    </>
  );
}

export default EventSearchPage;
