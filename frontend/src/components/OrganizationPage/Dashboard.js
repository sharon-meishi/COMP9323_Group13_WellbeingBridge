//Dashboard component: organization users main page display basic information
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles(() => ({
  titleStyle: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
  },
  Hi: {
    fontFamily: 'Noto Sans',
  },
  nameBox: {
    borderBottom: '2px solid #DCDCDC',
    paddingRight: '8px',
    paddingBottom: '8px',
  },
  nameStyle: {
    fontFamily: 'Noto Sans',
    paddingLeft: '8px',
    fontWeight: '700',
  },
  listItem: {
    fontFamily: 'Noto Sans',
    fontSize: '20px',
  },
  ButtonStyle: {
    marginLeft: '10px',
    color: '#216991',
    boxShadow: '0',
    borderColor: '#216991',
    '&:hover': {
      borderColor: '#216991',
      backgroundColor: '#216991',
      color: 'white',
    },
  },
}));

function Dashboard({ profileData }) {
  const classes = useStyles();
  const history = useHistory();

  const toMyPage = () => {
    history.push(`/organization/${profileData.oId}`);
  };
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='flex-start'
      width='100%'
      mt={10}
      pl={10}
    >
      <Box
        display='flex'
        alignItems='baseline'
        justifyContent='space-between'
        className={classes.nameBox}
        width='80%'
        flexWrap='wrap'
      >
        <Box
          display='flex'
          alignItems='baseline'
          justifyContent='space-between'
          width='100%'
          flexWrap='wrap'
        >
          <Box display='flex' alignItems='baseline'>
            <Typography variant='h2' className={classes.Hi} component={'div'}>
              Hi,
            </Typography>
            <Typography
              variant='h3'
              className={classes.nameStyle}
              component={'div'}
            >
              {profileData.organizationName}:)
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' flexWrap='wrap'>
            <Typography variant='h6' className={classes.Hi} component={'div'}>
              Your current rating:
            </Typography>
            <Box display='flex' alignItems='center'>
              <Rating
                value={profileData.rating}
                name='read-only'
                readOnly
                precision={0.5}
              />
              <Typography variant='h6' className={classes.Hi} component={'div'}>
                {profileData.rating || ''}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={3} width='80%' display='flex' flexDirection='column'>
        <Box display='flex' alignSelf='flex-end' fontSize='17px'>
          <Box>Email:</Box>
          {profileData.email}
        </Box>
        <Box display='flex'>
          <Typography
            variant='h5'
            className={classes.titleStyle}
            component={'div'}
          >
            Welcome to your dashboard! Here is your organization page
          </Typography>
          <Button
            href='#'
            onClick={toMyPage}
            variant='outlined'
            className={classes.ButtonStyle}
          >
            Organization Page
          </Button>
        </Box>

        <Typography
          variant='h5'
          className={classes.titleStyle}
          component={'div'}
        >
          And here are what you can do in dashboard:
        </Typography>

          <ul className={classes.listItem}>
            <li>Manage events you created</li>
            <li>Edit your organization page</li>
            <li>Change your account setting</li>
          </ul>
      </Box>
    </Box>
  );
}

export default Dashboard;
