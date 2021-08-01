import React from 'react';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import EventForm from '../components/EventEditPage/EventForm';//sdsd

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
