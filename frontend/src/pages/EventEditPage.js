import React, { useState, useEffect } from 'react';
import parse from 'date-fns/parse';
import Alert from '@material-ui/lab/Alert';
import NavBar from '../components/NavigationBar/NavBar';
import BackToTop from '../components/Public/BackToTop';
import EventForm from '../components/EventEditPage/EventForm';
import { getEventDetails } from '../components/Helper/api';

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}

function EventEditPage(props) {
  const eventId = props.match.params.eventId;
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const parsedDate = (dateString, format) => {
    return parse(dateString, format, new Date());
  };

  useEffect(() => {
    const fetchData = async (eventId) => {
      const Data = await getEventDetails(eventId);
      if (Data[0] === 200) {
        setRawData(Data[1]);
        
        const time = Data[1].time.split('to');
        const startTime = parsedDate(time[0], 'h:mm aa ');
        const endTime = parsedDate(time[1], ' h:mm aa');
        const processedData = {
          EventName: Data[1].eventName,
          EventFormat: Data[1].format,
          EventCategory: Data[1].category,
          EventIntroduction: Data[1].introduction,
          EventDetails: Data[1].details,
          StartDate: parsedDate(Data[1].startdate, 'dd/MM/yyyy'),
          EndDate: parsedDate(Data[1].enddate, 'dd/MM/yyyy'),
          StartTime: startTime,
          EndTime: endTime,
          Postcode: Data[1].location.postcode,
          lat: Data[1].location.lat,
          lng: Data[1].location.lng,
        };
        setData(processedData);
      } else {
        setErrorMsg(`Something wrong ${Data[1]}`);
      }
    };
    if (eventId) {
      fetchData(eventId);
    }
  }, [eventId]);

  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      {errorMsg ? <FetchAlert severity='error'>{errorMsg}</FetchAlert> : null}
      {data ? (
        <EventForm
          eventId={eventId}
          preloadedValues={data}
          preloadedImg={rawData.thumbnail}
          preloadedAddress={rawData.location.address}
        />
      ) : null}
    </>
  );
}

export default EventEditPage;
