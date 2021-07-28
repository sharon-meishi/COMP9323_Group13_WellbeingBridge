import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import MultiSelect from 'react-multi-select-component';
import { Input, Button, Select, Dropdown, Menu } from 'semantic-ui-react';
import EventSearchResult from './EventSearchResult';
import DatePicker from 'react-datepicker';
import PostalCodeAutoComplete from '../EventEditPage/PostalCodeAutoComplete';
import 'react-datepicker/dist/react-datepicker.css';

const useStyles = makeStyles({
  search: {
    width: '100%',
    backgroundColor: '#D9F4F2',
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: '20px',
  },
  titleStyle: {
    fontSize: '35px',
    fontWeight: 'bold',
  },
  selectStyle: {
    minWidth: '300px',
    marginTop: '3px',
  },
  inputStyle: {
    minWidth: '300px',
    marginTop: '3px',
    minHeight: '44px',
  },
  rangeStyle: {
    marginTop: '3px',
    height: '90%',
  },
  linkStyle: {
    fontWeight: 'bold',
    pointer: 'cursor',
  },
  pickerStyle: {
    minWidth: '300px',
    height: '38px',
    fontSize: '15px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    padding: '5px 8px',
    marginTop: '8px',
  },
});

const formatOptions = [
  { label: 'Class', value: 'Class' },
  { label: 'Conference', value: 'Conference' },
  { label: 'Festival', value: 'Festival' },
  { label: 'Party', value: 'Party' },
  { label: 'Expo', value: 'Game' },
  { label: 'Networking', value: 'Networking' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Race', value: 'Race' },
  { label: 'Seminar', value: 'Tour' },
];

const categoryOptions = [
  { label: 'Health and fitness', value: 'Health and fitness' },
  { label: 'Multicultural', value: 'Multicultural' },
  { label: 'Sports and recreation', value: 'Sports and recreation' },
  { label: 'Family', value: 'Family' },
  { label: 'Community organised', value: 'Community organised' },
  { label: 'Kids', value: 'Kids' },
  { label: 'Seniors', value: 'Seniors' },
  { label: 'Young People', value: 'Young People' },
];

const options = [
  { key: '5 km', text: '5 km', value: '5 km' },
  { key: '10 km', text: '10 km', value: '10 km' },
  { key: '20 km', text: '20 km', value: '20 km' },
];

function EventSearch({ match, location }) {
  console.log(window.location.search.substring(1));
  const classes = useStyles();
  const { reset, control } = useForm();
  const [format, setFormat] = useState([]);
  const [category, setCategory] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <>
      <Box className={classes.search}>
        <Box className={classes.titleStyle} mt={5} mb={5}>
          Find Events
        </Box>
        <Box
          display='flex'
          width='100%'
          justifyContent='center'
          flexWrap='wrap'
        >
          <Box display='flex' flexDirection='column'>
            <label>Event Keyword: </label>
            <Input
              placeholder='Event Keyword...'
              className={classes.inputStyle}
            />
          </Box>
          <Box ml={1}>
            <label>Event Format: </label>
            <MultiSelect
              options={formatOptions}
              value={format}
              onChange={setFormat}
              labelledBy='Select'
              className={classes.selectStyle}
            />
          </Box>
          <Box ml={1}>
            <label>Event Category: </label>
            <MultiSelect
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              labelledBy='Select'
              className={classes.selectStyle}
            />
          </Box>
        </Box>
        <Box
          mt={1}
          display='flex'
          width='100%'
          justifyContent='center'
          flexWrap='wrap'
        >
          <Box>
            <label>Start Date: </label>
            <Box>
              <DatePicker
              dateFormat='dd/MM/yyyy'
               selected={startDate}
                onChange={(date) => setStartDate(date)}
                className={classes.pickerStyle}
              />
            </Box>
          </Box>
          <Box ml={1}>
            <label>End Date: </label>
            <Box>
              <DatePicker
              dateFormat='dd/MM/yyyy'
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className={classes.pickerStyle}
              />
            </Box>
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            style={{ minWidth: '300px' }}
            ml={1}
          >
            <label>Event Location: </label>
            <Box display='flex' width='100%' justifyContent='space-between'>
              <Box flexGrow='1'>
                <PostalCodeAutoComplete control={control} />
              </Box>
              <Box pt={1}>
                <Dropdown
                  defaultValue='5 km'
                  options={options}
                  selection
                  style={{ minWidth: '50px', maxHeight: '45px' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box mt={3}>
          <Button color='teal'>Search</Button>
        </Box>
      </Box>
      <EventSearchResult />
    </>
  );
}

export default EventSearch;
