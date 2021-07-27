import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MultiSelect from 'react-multi-select-component';

const useStyles = makeStyles({
  search: {
    width: '100%',
    backgroundColor: '#D9F4F2',
    padding: '10px',
    display:'flex',
    // justifyContent: 'space-around'
  },
  selectStyle: {
    minWidth:'200px',
    marginTop: '3px'
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

function EventSearch({match, location}) {

    console.log(window.location.search.substring(1))
  const classes = useStyles();
  const [format, setFormat] = useState([]);
  const [category, setCategory] = useState([]);



  return (
    <>
      <Box className={classes.search}>
        <Box>
          <label>Event Format: </label>
          <MultiSelect
            options={formatOptions}
            value={format}
            onChange={setFormat}
            labelledBy='Select'
            className={classes.selectStyle}
          />
        </Box>
        <Box>
          <label>Event Category: </label>
          <MultiSelect
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            labelledBy='Select'
            className={classes.selectStyle}
          />
        </Box>        
        <Box>
          <label>Event Location: </label>
          <MultiSelect
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            labelledBy='Select'
            className={classes.selectStyle}
          />
        </Box>
      </Box>
    </>
  );
}

export default EventSearch;
