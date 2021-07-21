import React from 'react';
import OrgEventCard from './OrgEventCard';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root:{
        display:'flex',
        flexDirection:'row',
        // justifyContent:'space-between',
    },
    item: {
        width: '100%'
      },
  }));
function EventDisplay(props) {
    console.log('coming into eventdisplay')
    console.log(props.profileData);
    console.log(props.profileData.publishedEvent);
    const event_list = props.profileData.publishedEvent;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {event_list.map((eventId) => (
            <OrgEventCard
              key={eventId}
              eventId={eventId}
              className={classes.item}
            ></OrgEventCard>))}
        </div>
        
    )
}

export default EventDisplay
