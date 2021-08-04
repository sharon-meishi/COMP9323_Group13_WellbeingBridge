import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventCard from '../EventCard';
import EventMap from './EventMap';
import { getEventSummary } from '../api';

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
  mapStyle: {
    padding: '1% 1% 0 5%',
    marginBottom: '30px',
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px',
  },
  titleStyle: {
    marginBottom: '2%',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  eventBox: {
    height: '70vh',
    overflow: 'scroll',
  },
  onlyEvents: {
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
  },
}));

function EventSearchResult({ result, address }) {
  const classes = useStyles();
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        result.map((id) => getEventSummary(id, true))
      );
      setEventList(data);
    };
    fetchData();
  }, [result]);

  return (
    <Grid container justify='center' style={{marginTop: '16px'}}>
      {address ? (
        <Grid container className={classes.container}>
          <Grid item xs={7} className={classes.mapStyle}>
            <EventMap eventList={eventList} center={address} />
          </Grid>
          <Grid container item xs={6} className={classes.eventResult}>
            <Box className={classes.titleStyle}>
              {result.length} events near <span style={{textDecoration: 'underline'}}>{address}</span>
            </Box>
            <Grid
              container
              item
              justify='space-between'
              className={classes.eventBox}
            >
              {result.map((eventId) => (
                <Grid item xs={12} md={6} className={classes.item}>
                  <EventCard key={eventId} eventId={eventId}></EventCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container item xs={11} md={8} lg={8}  className={classes.onlyEvents}>
          <Box className={classes.titleStyle}>
            {result.length} matching results:
          </Box>
          <Grid container item>
          {result.map((eventId) => (
            <Grid item xs={12} md={6} lg={4} className={classes.item}>
              <EventCard key={eventId} eventId={eventId}></EventCard>
            </Grid>
          ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventSearchResult;
