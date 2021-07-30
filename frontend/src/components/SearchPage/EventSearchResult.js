import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import EventCard from '../EventCard';

const useStyles = makeStyles((theme) => ({
    container: {
       padding: '1% 20%',
       [theme.breakpoints.down('md')]: {
        padding: '1% 15%',
      },
    },
    item: {
      display:'flex',
      justifyContent:'center'
    },
    titleStyle: {
        marginBottom:'1%',
        fontSize:'20px',
        fontWeight:'bold'
    }
}))

function EventSearchResult() {
    const classes = useStyles()
  return (
    <Grid container className={classes.container}>
      <Box className={classes.titleStyle}>3 matching results</Box>
      <Grid  container justify='center' spacing={3}>
        {[1, 2, 3].map((eventId) => (
          <Grid item xs={11} md={5} lg={4} className={classes.item}>
            <EventCard key={eventId} eventId={eventId}></EventCard>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default EventSearchResult;
