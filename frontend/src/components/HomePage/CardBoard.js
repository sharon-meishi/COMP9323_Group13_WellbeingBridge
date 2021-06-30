import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import HomePageButton from '../HomePageButton';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    // backgroundColor:'#C5EDF9',
    // justifyContent:'center',
    direction: 'row',
    justifyContent: 'space-around ',
    alignItems: 'space-between',
    padding: '0 20% 0 20%',
  },
  text: {
    // justifyContent:'space-between',
    // backgroundColor:'black',
    // margin: '20px',
    textDecoration: 'underline',
    padding: '1% 0 0 0',
  },
  title:{
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
  }
});
const CardBoard = () => {
  const classes = useStyles();
  const event_list = [
    {
      eventId: 1,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
    {
      eventId: 2,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
    {
      eventId: 3,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
    {
      eventId: 4,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
    {
      eventId: 5,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
    {
      eventId: 6,
      thumbnail: 'image link',
      name: 'Community Yoga Class',
      date: '',
      location: {
        postcode: '2131',
        suburb: 'Ashfield NSW',
      },
      favourite: true,
    },
  ];
  // const event_board = event_list.map(event => <EventCard key={event.eventId} className={classes.item}></EventCard>);
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='space-between'>
      <Box className={classes.title}>
        <Typography variant='h4'  className={classes.text}>
          What's on
        </Typography>
        <HomePageButton text='Find an event' />
      </Box>
      <Grid container className={classes.root}>
        {event_list.map((event) => (
          <EventCard
            key={event.eventId}
            className={classes.item}
            info={event}
          ></EventCard>
        ))}
      </Grid>
    </Box>
  );
};

export default CardBoard;
