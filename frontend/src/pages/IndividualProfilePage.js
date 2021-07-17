import React from 'react';
import NavBar from '../components/NavBar';
import BackToTop from '../components/BackToTop';
import ProfileEditForm from '../components/ProfileEditForm'

function IndividualUserProfilePage() {
  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
    </>
  );
}

export default IndividualUserProfilePage;
