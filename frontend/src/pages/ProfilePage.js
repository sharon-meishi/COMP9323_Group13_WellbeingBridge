import React from 'react';
import NavBar from '../components/NavBar'
import SideBar from '../components/ProfilePage/SideBar';

function ProfilePage(props) {
  const id = props.match.params.id;
  return (
    <>
    {/* <NavBar/> */}
    <SideBar/>
    </>
  );
}

export default ProfilePage;
