import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';

const useStyles = makeStyles({
    container: {
       padding: '1% 20%'
    },
    item: {
        alignSelf: 'center'
    },
    titleStyle: {
        marginBottom:'1%',
        fontSize:'20px',
        fontWeight:'bold'
    }
})

function EventSearchResult() {
    const classes = useStyles()
  return (
    <Grid container className={classes.container}>
      <Box className={classes.titleStyle}>3 matching results</Box>
      <Grid item container justify='space-around' >
        {[1, 2, 3].map((eventId) => (
          <Grid >
            <EventCard key={eventId} eventId={eventId}></EventCard>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default EventSearchResult;
