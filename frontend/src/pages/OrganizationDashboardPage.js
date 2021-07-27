import React, { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import VerticalTab from '../components/OrganizationPage/VerticalTab';
import { getOrganizationProfile } from '../components/api';

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}


function OrganizationDashboardPage() {
  const [profileData, setProfileData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const Data = await getOrganizationProfile(sessionStorage.getItem('id'));
      if (Data[0] === 200) {
        setProfileData(Data[1]);
        setUpdate(false);
      } else {
        setErrorMsg(Data[1]);
      }
    };
    fetchData();
  }, [update]);

  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      {errorMsg ? <FetchAlert severity='error'>{errorMsg}</FetchAlert> : null}
      {profileData ? <VerticalTab profileData={profileData} setUpdate={setUpdate}/> : null}
    </>
  );
}

export default OrganizationDashboardPage;
