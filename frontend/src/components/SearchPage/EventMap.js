import React, {useState} from 'react'
import GoogleMapReact from 'google-map-react'

const AnyReactComponent = ({text}) => <div>{text}</div>;

function EventMap() {
    const [center, setCenter] = useState({lat: -33.884895, lng: 151.135696 });
    const [zoom, setZoom] = useState(11);
    return (
        <div style={{ height: '70vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCz4t6JLp6xmiyAKnWa4MJnv16tH3EpOxA' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={-33.884895}
            lng={151.135696}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
}

export default EventMap
