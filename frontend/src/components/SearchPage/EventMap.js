import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function EventMap({ eventList, center }) {
  console.log(center);
  console.log(eventList);
  const defaultProps = {
    center: {
      lat: -33.884895,
      lng: 151.135696,
    },
    zoom: 12,
  };
  return (
    
    <div style={{ height: '70vh', width: '100%' }}>
      {eventList ? 
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCz4t6JLp6xmiyAKnWa4MJnv16tH3EpOxA' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {eventList.map((each) => (
          <AnyReactComponent
            lat={parseFloat(each.location.Lat)}
            lng={parseFloat(each.location.Lng)}
            text={each.name}
          />
        ))}
      </GoogleMapReact> : null}
    </div>
  );
}

export default EventMap;
