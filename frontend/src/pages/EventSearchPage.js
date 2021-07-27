import React from 'react';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import EventSearch from '../components/SearchPage/EventSearch'

function EventSearchPage() {
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      <EventSearch/>
    </>
  );
}

export default EventSearchPage;
