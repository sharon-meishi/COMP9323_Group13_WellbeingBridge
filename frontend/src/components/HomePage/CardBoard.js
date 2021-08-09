//CardBoard component: a cardboard to fetch eventIds and load 
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EventCard from '../EventCard';
import HomePageButton from './HomePageButton';
import { getPopularEventId } from '../Helper/api';

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
    width: '100%',
  },
  eventBox: {
    display: 'flex',
    padding:'16px 0',
    width: '100%',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
  eventItem : {
    display:'flex',
    justifyContent: 'center'
  }
}));

const CardBoard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [event_list, setEventlist] = useState([]);
  const fetchOrigin = async () => {
    const res = await getPopularEventId();
    if (res[0] === 200) {
      setEventlist(res[1].event_id);
    } else {
      console.log('something wrong in CardBoard');
    }
  };
  useEffect(() => fetchOrigin(), []);

  const toEventSearch = () => {
    history.push('/event/search')
  }

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
              Popular events
            </Typography>
            <HomePageButton text='More Events' onClick={toEventSearch}/>
          </Box>
          <Grid container className={classes.eventBox} spacing={2}>
            {event_list.map((eventId) => (
              <Grid item xs={12} md={6} lg={4}key={eventId} className={classes.eventItem}>
              <EventCard
                key={eventId}
                eventId={eventId}
                className={classes.item}
              ></EventCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardBoard;
