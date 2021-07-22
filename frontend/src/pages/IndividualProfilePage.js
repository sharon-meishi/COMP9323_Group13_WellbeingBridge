import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ProfileTabMenu from '../components/IndividualProfilePage/ProfileTabMenu';
import SettingsIcon from '@material-ui/icons/Settings';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/BackToTop';
import ProfileEditForm from '../components/IndividualProfilePage/ProfileEditForm';
import { getUserProfile } from '../components/api';

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(() => ({
  containerStyle: {
    marginTop: '30px',
    width: '100%',
  },
  fontStyle: {
    fontFamily: 'Noto Sans',
    fontWeight: '700',
  },
  itemStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '30px',
    width: '100%',
  },
  buttonStyle: {
    color: '#216991',
    boxShadow: '0',
    borderColor: '#216991',
    '&:hover': {
      borderColor: '#216991',
      backgroundColor: '#216991',
      color: 'white',
    },
  },
  titleStyle: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#26A69A',
  },
}));

function IndividualUserProfilePage() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [update, setUpdate] = useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const Data = await getUserProfile();
      if (Data[0] === 200) {
        console.log(Data[1]);
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
      {profileData ? (
        <>
          <Dialog open={open} onClose={handleClose} maxWidth='md'>
            <DialogContent>
              <Typography className={classes.titleStyle}>
                Edit your nickname or password
              </Typography>
            </DialogContent>
            <ProfileEditForm
              currentName={profileData.Nickname}
              setOpen={setOpen}
              setUpdate={setUpdate}
            />
          </Dialog>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'
            className={classes.containerStyle}
          >
            <Grid
              container
              item
              xs={11}
              sm={9}
              md={8}
              className={classes.itemStyle}
            >
              <Box display='flex' flexDirection='column' width='100%' mb={4}>
                <Box display='flex' justifyContent='space-between' mb={3}>
                  <Typography variant='h4' className={classes.fontStyle}>
                    {profileData.Nickname}
                  </Typography>
                  <Button
                    variant='outlined'
                    className={classes.buttonStyle}
                    onClick={() => setOpen(true)}
                  >
                    <SettingsIcon fontSize='small' />
                    Edit Profile
                  </Button>
                </Box>
                <Divider />
                <Box display='flex' justifyContent='space-between' mt={3}>
                  <Typography className={classes.fontStyle}>Email:</Typography>
                  <Typography>{profileData.Email}</Typography>
                </Box>
              </Box>
              <Grid container item>
                <ProfileTabMenu
                  FavEvents={profileData.FavouriteId}
                  BookEvents={profileData.BookingId}
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : null}
    </>
  );
}

export default IndividualUserProfilePage;
