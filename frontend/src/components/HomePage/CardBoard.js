import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HomePageButton from '../HomePageButton';
import Box from '@material-ui/core/Box';
import { getPopularEventId } from '../api';

const useStyles = makeStyles({
  root: {
    direction: 'row',
    justifyContent: 'space-around ',
    alignItems: 'space-between',
    padding: '0 10% 0 10%',
  },
  text: {
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '500',
    textDecoration: 'underline',
    padding: '1% 0 0 0',
  },
  title: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
const CardBoard = () => {
  const [event_list, setEventlist] = useState([]);
  const classes = useStyles();

  const fetchOrigin = async () => {
    const res = await getPopularEventId();
    if (res[0] === 200) {
      setEventlist(res[1].event_id);
    } else{
      console.log('something wrong')
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
      <Box className={classes.title}>
        <Typography variant='h4' className={classes.text}>
          What's on
        </Typography>
        <HomePageButton text='Find an event' />
      </Box>
      <Grid container className={classes.root}>
        {event_list.map((eventId) => (
          <EventCard
            key={eventId}
            eventId={eventId}
            className={classes.item}
          ></EventCard>
        ))}
      </Grid>
    </Box>
  );
};

export default CardBoard;
