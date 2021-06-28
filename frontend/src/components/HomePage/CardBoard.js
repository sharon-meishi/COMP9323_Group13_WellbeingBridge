import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    // backgroundColor:'#C5EDF9',
    // justifyContent:'center',
    direction:"row",
    justifyContent:"space-around ",
    alignItems:"space-between",
    padding:'0 10% 0 10%',
  },
  text:{
    // justifyContent:'space-between',
    // backgroundColor:'black',
    // margin: '20px',
    textDecoration:'underline',
    padding:'1% 13% 0 13%',
  }

});
const CardBoard = () => {
  const classes = useStyles();
  const event_list = [{
    "eventId": 1,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  },{
    "eventId": 2,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  },{
    "eventId": 3,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  },{
    "eventId": 4,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  },{
    "eventId": 5,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  },{
    "eventId": 6,
    "thumbnail": "image link",
    "name": "Community Yoga Class",
    "date": "",
    "location": {
      "postcode": "2131",
      "suburb": "Ashfield NSW"
    },
    "favourite": true
  }];
  // const event_board = event_list.map(event => <EventCard key={event.eventId} className={classes.item}></EventCard>);
  return (
    <div>
      <Typography variant="h4" className={classes.text}>What's on</Typography>
      <Grid container className={classes.root}>
        {event_list.map(event => <EventCard key={event.eventId} className={classes.item} info={event}></EventCard>)}
      </Grid>

    </div>
  )
}

export default CardBoard;