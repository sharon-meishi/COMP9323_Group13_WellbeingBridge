import React from 'react';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/Public/BackToTop';
import EventForm from '../components/EventEditPage/EventForm';

function EventCreatePage() {
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      <EventForm />
    </>
  );
}

export default EventCreatePage;
