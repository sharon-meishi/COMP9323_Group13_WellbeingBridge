import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import BackToTop from '../components/BackToTop';
import { getEventDetails } from '../components/api';
import LoadingBackdrop from '../components/LoadingBackdrop'
import placeholder from '../Assets/placeholder.png';


import EventForm from '../components/EventEditPage/EventForm';
import parse from 'date-fns/parse';



function EventEditPage(props) {
  const eventId = props.match.params.eventId;
  const [rawData, setRawData] = useState(null);
  const [data, setData] = useState(null);

  const parsedDate = (dateString, format) => {
    return parse(dateString, format, new Date());
  };

  useEffect(() => {
    const fetchData = async (eventId) => {
      const Data = await getEventDetails(eventId);
      if (Data[0] === 200) {
        console.log(Data[1]);
        setRawData(Data[1]);

        const date = Data[1].date.split(' ');
        const time = Data[1].time.split('to');
        let startDate, endDate;

        console.log(date);
        console.log(time);
        if (date.length === 3) {
          startDate = parsedDate(date[0], 'dd/MM/yyyy');
          endDate = parsedDate(date[2], 'dd/MM/yyyy');
        } else {
          startDate = parsedDate(date[0], 'dd/MM/yyyy');
          endDate = parsedDate(date[0], 'dd/MM/yyyy');
        }
        const startTime = parsedDate(time[0], 'h:mm aa ');
        const endTime = parsedDate(time[1], ' h:mm aa');

        const processedData = {
          EventName: Data[1].eventName,
          EventFormat: Data[1].format,
          EventIntroduction: Data[1].introduction,
          EventDetails: Data[1].details,
          StartDate: startDate,
          EndDate: endDate,
          StartTime: startTime,
          EndTime: endTime,
          Postcode: Data[1].location.postcode,
        };
        setData(processedData);
      } else {
        console.log('error', Data[0]);
      }
    };
    if (eventId) {
      console.log(eventId);
      fetchData(eventId);
    }
  }, []);

  return (
    <>
      <BackToTop showBelow={250} />
      <NavBar />
      {data ? (
        <EventForm
          eventId={eventId}
          preloadedValues={data}
          preloadedImg={rawData.thumbnail}
          preloadedAddress={rawData.location.venue}
        />
      ) : (
       null
      )}
    </>
  );
}

export default EventEditPage;
