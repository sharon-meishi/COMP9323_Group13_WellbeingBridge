import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import { Dropdown, Menu } from 'semantic-ui-react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EventCard from '../EventCard';
import EventMap from './EventMap';
import { getEventSummary } from '../api';
import { set } from 'react-hook-form';

//three type of sort function
const menuItem = [
  {
    key: 'newest',
    text: 'newest',
    value: 'newest',
  },
  {
    key: 'most booked',
    text: 'most booked',
    value: 'most booked',
  },
  {
    key: 'category',
    text: 'category',
    value: 'category',
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
  const [notOnlineList, setnotOnlineList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        result.map((id) => getEventSummary(id, true))
      );
      const notOnline = data.filter((event) => event.format !== 'Online Event');
      setnotOnlineList(notOnline);
      setEventList(data);
    };
    fetchData();
    context.setSelected(null);
  }, [result]);

  const handleChange = (e, data) => {
    if (data.value === 'newest'){
      const myData = []
        .concat(eventList)
        .sort((a, b) => (a.eventId < b.eventId ? 1 : -1))
      setEventList(myData)
    } else if (data.value === 'most booked'){
      const myData = []
      .concat(eventList)
      .sort((a, b) => (a.bookedUser.length < b.bookedUser.length ? 1 : -1))
    setEventList(myData)
    } else if (data.value === 'category'){
      const myData = []
      .concat(eventList)
      .sort((a, b) => (a.category < b.category ? 1 : -1))
      setEventList(myData)
    }
  }



  return (
    <Grid container justify='center' style={{ marginTop: '16px' }}>
      {address ? (
        <Grid container className={classes.container}>
          <Grid item xs={7} className={classes.mapStyle}>
            <EventMap
              key={notOnlineList}
              eventList={notOnlineList}
              center={center}
            />
          </Grid>
          <Grid container item xs={6} className={classes.eventResult}>
            <Box className={classes.titleStyle}>
              {result.length} events near
              <span style={{ textDecoration: 'underline' }}>{address}</span>:
            </Box>
            <Grid container item className={classes.eventBox}>
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
          <Box display='flex' justifyContent='space-between' alignItems='baseline' mb={1}>
            <Box className={classes.titleStyle}>
              {result.length} matching results:
            </Box>
            <Box display='flex' alignItems='baseline'>
              <Box fontSize='17px' mr={1} fontWeight='bold'>sort by</Box>
              <Menu>
              <Dropdown
                inline
                simple
                item
                options={menuItem}
                defaultValue={menuItem[0].value}
                onChange={handleChange}
                style={{ marginLeft: '3px' }}
              />
              </Menu>
            </Box>
          </Box>
          <Grid container item>
            {eventList.map((event) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                className={classes.item}
                key={event.eventId}
              >
                <EventCard
                  eventInfo={event}
                  eventId={event.eventId}
                ></EventCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

export default EventSearchResult;
