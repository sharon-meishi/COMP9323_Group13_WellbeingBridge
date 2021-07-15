import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import BackToTop from '../components/BackToTop';
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