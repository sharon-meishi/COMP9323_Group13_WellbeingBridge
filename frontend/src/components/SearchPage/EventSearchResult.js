import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventCard from '../EventCard';
import EventMap from './EventMap';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  eventResult: {
    padding: '1% 2%',
    [theme.breakpoints.down('md')]: {
      padding: '1% 2%',
    },
    display: 'flex',
    flexDirection: 'column',
  },
  mapStyle:{
    padding: '1% 1% 0 5%',
    marginBottom: '30px'
  }
,
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center'
  },
  titleStyle: {
    marginBottom: '1%',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  eventBox: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

function EventSearchResult(props) {
  const classes = useStyles();
  return (
    <Grid container className={classes.container}>
      <Grid item xs={5} className={classes.mapStyle}>
        <EventMap />
      </Grid>
      <Grid container item xs={7} className={classes.eventResult}>
        <Box className={classes.titleStyle}>
          {props.result.length} matching results
        </Box>
        <Grid container item justify='space-between' spacing={3}>
          {props.result.map((eventId) => (
            <Grid item xs={12} md={5} lg={4} className={classes.item}>
              <EventCard key={eventId} eventId={eventId}></EventCard>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EventSearchResult;
