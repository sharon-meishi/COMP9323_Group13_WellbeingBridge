//Event map component: diplay google map
import React, { useContext } from 'react';
import { AppContext } from '../../utils/store';
import { useHistory } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import markerCss from './marker.module.css';
import RoomIcon from '@material-ui/icons/Room';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Popup } from 'semantic-ui-react';

const Marker = ({ text }) => {
  return (
    <>
      <div className={markerCss.pin}></div>
      <div className={markerCss.pulse}>{text}</div>
    </>
  );
};

const useStyles = makeStyles({
  button: {
    margin: '-20px 0 0 -20px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: 'none',
      color: 'red',
    },
  },
});

function EventMap({ eventList, center }) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const history = useHistory();

  const handleMarkerClick = (id) => {
    context.setSelected(id);
  };

  const openGoogleMap = (lat, lng) => {
    console.log(lat, lng);
    window.open('https://maps.google.com?q=' + lat + ',' + lng);
  };

  const getMapOptions = (maps) => {
    return {
      disableDefaultUI: true,
      mapTypeControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }],
        },
      ],
    };
  };
  const defaultProps = {
    center: {
      lat: center.lat,
      lng: center.lng,
    },
    zoom: 12,
  };
  console.log(eventList)
  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCz4t6JLp6xmiyAKnWa4MJnv16tH3EpOxA' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={getMapOptions}
      >
        <Marker lat={center.lat} lng={center.lng} text='You' />
        {eventList.map((each, idx) =>
          each.location.Lat && each.location.Lng ? (
            <Popup
              key={each.eventId}
              on='click'
              pinned
              lat={parseFloat(each.location.Lat)}
              lng={parseFloat(each.location.Lng)}
              style={{ margin: '-20px 0 0 -20px' }}
              content={
                <Box >
                  <Box mb={1} style={{ fontSize: '18px' }}>
                    {each.name}
                  </Box>
                  <Link
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      openGoogleMap(
                        parseFloat(each.location.Lat),
                        parseFloat(each.location.Lng)
                      )
                    }
                  >
                    Open in google map
                  </Link>
                </Box>
              }
              trigger={
                <Link
                  href={`#${idx + 1}`}
                  underline='none'
                  onClick={() => handleMarkerClick(idx + 1)}
                >
                  <IconButton
                    color='primary'
                    size='large'
                    className={classes.button}
                  >
                    {idx + 1}
                    <RoomIcon fontSize='large' />
                  </IconButton>
                </Link>
              }
            />
          ) : null
        )}
      </GoogleMapReact>
    </div>
  );
}

export default EventMap;
