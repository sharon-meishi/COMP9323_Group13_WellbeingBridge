import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';
import OrgEventCard from '../OrganizationPage/OrgEventCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HomePageButton from '../HomePageButton';
import Box from '@material-ui/core/Box';
import { getPopularEventId } from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between ',
    alignItems: 'center',
  },
  text: {
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '500',
    textDecoration: 'underline',
    padding: '1% 0 0 0',
  },
  title: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    width: '100%'
  },
  eventBox: {
    display:'flex',
    width:'100%',
    justifyContent:'space-between',
    flexWrap:'wrap',
    [theme.breakpoints.down('md')]: {
      justifyContent:'center',
    },
  }
}));
const CardBoard = () => {
  const [event_list, setEventlist] = useState([]);
  const classes = useStyles();
  const usergroup = sessionStorage.getItem('usergroup');
  console.log(`usergroup = ${usergroup}`);
  const fetchOrigin = async () => {
    const res = await getPopularEventId();
    if (res[0] === 200) {
      setEventlist(res[1].event_id);
    } else {
      console.log('something wrong in CardBoard');
    }
  };
  useEffect(() => fetchOrigin(), []);

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='space-between'
    >
      <Grid container className={classes.root}>
        <Grid item sm={10} md={9} xl={8} className={classes.item}>
          <Box className={classes.title} mt={1}>
            <Typography variant='h4' className={classes.text}>
              What's on
            </Typography>
            <HomePageButton text='Find Event' />
          </Box>
          {usergroup === 'organization'?
            <Box className={classes.eventBox} >
              {event_list.map((eventId) => (
                <OrgEventCard
                  key={eventId}
                  eventId={eventId}
                  className={classes.item}
                ></OrgEventCard>
              ))}
            </Box>
            :<Box className={classes.eventBox} >
            {event_list.map((eventId) => (
              <EventCard
                key={eventId}
                eventId={eventId}
                className={classes.item}
              ></EventCard>
            ))}
          </Box>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardBoard;
