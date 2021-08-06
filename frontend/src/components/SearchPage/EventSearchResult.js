import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import { Dropdown } from 'semantic-ui-react'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventCard from '../EventCard';
import EventMap from './EventMap';
import { getEventSummary } from '../api';

  //three type of sort function
  const menuItem = [
    {
      key: 'newest',
      text: 'newest',
      value: 'newest',
    },
    {
      key: 'most popular',
      text: 'most popular',
      value: 'most popular',
    },
    {
      key: 'type',
      text: 'type',
      value: 'type',
    },
  ];

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
    alignItems: 'flex-start',
  },
  onlyEvents: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  selected: {
    border: '3px solid #26A69A',
    padding: '16px',
    borderRadius: '5px',
  },
}));

function EventSearchResult({ result, address, center }) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const [eventList, setEventList] = useState([]);
  const [notOnlineList, setnotOnlineList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        result.map((id) => getEventSummary(id, true))
      );
      const notOnline = data.filter(
        (event) => event.format !== 'Online Event'
      )
      setnotOnlineList(notOnline)
      setEventList(data);
    };
    fetchData();
    context.setSelected(null)
  }, [result]);

  return (
    <Grid container justify='center' style={{ marginTop: '16px' }}>
      {address ? (
        <Grid container className={classes.container}>
          <Grid item xs={7} className={classes.mapStyle}>
            <EventMap key={notOnlineList} eventList={notOnlineList} center={center} />
          </Grid>
          <Grid container item xs={6} className={classes.eventResult}>
            <Box className={classes.titleStyle}>
              {result.length} events near
              <span style={{ textDecoration: 'underline' }}>{address}</span>:
            </Box>
            <Grid container item  className={classes.eventBox}>
              {result.map((eventId, idx) => (
                <Grid
                  item
                  xs={11}
                  md={8}
                  lg={6}
                  className={classes.item}
                  key={eventId}
                >
                  <EventCard eventId={eventId} order={idx + 1}></EventCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          item
          xs={11}
          md={8}
          lg={8}
          className={classes.onlyEvents}
        >
          <Box className={classes.titleStyle}>
            {result.length} matching results:
          </Box>
          <Grid container item>
            {eventList.map((event) => (
              <Grid item xs={12} md={6} lg={4} className={classes.item} key={event.eventId}>
                <EventCard  eventInfo={event} eventId={event.eventId}></EventCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventSearchResult;
