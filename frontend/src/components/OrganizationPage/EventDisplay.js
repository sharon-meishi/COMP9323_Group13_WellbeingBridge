import React, { useState, useEffect } from 'react';
import OrgEventCard from './OrgEventCard';
import { makeStyles } from '@material-ui/core/styles';
import { getEventSummary } from '../api';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  eventBox: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '75%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  item: {
    width: '100%',
  },
}));
function EventDisplay(props) {
  const classes = useStyles();
  const event_list = props.profileData.publishedEvent;
  const [start, setStart] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [loadMore, setLoadMore] = useState(event_list.length > 3 ? true : false);
  const [end, setEnd] = useState(event_list.length > 3 ? 3 : event_list.length);

  const loadMoreHandler = () => {
    if (end + 3 >= event_list.length) {
      setEnd(event_list.length);
      setStart(end);
      setLoadMore(false);
    } else {
      setEnd(end + 3);
      setStart(start + 3);
    }
  };

  useEffect(() => {
    const fetchData = async() => {
      const data = await Promise.all(
        event_list.slice(start, end).map((id) => getEventSummary(id, true))
      );
      setEventList((prevEvents) => prevEvents.concat(data));
    }
    if (end > start){
      fetchData()
    }
  }, [start])

  useEffect(() => {
    setLoadMore(event_list.length > 3 ? true : false)
  }, [event_list])
  
  return (
    <>
    <div className={classes.eventBox}>
      {eventList.map((event) => (
        <OrgEventCard 
        key={event.eventId}
        eventId={event.eventId}
        eventName={event.name}
        eventDate={event.date}
        postcode={event.location.address}
        introduction={event.introduction}
        thumbnail={event.thumbnail}
         />
      ))}
    </div>
    <Box>
        <Button color='primary' variant='contained' onClick={loadMoreHandler}>
          Load More
        </Button>
      </Box>
    </>
  );
}

export default EventDisplay;
