import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import MultiSelect from 'react-multi-select-component';
import { Input, Button, Dropdown } from 'semantic-ui-react';
import EventSearchResult from './EventSearchResult';
import DatePicker from 'react-datepicker';
import PostalCodeAutoComplete from '../EventEditPage/PostalCodeAutoComplete';
import dateFormat from 'date-fns/format';
import parse from 'date-fns/parse';
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
    minWidth: '350px',
    marginTop: '3px',
  },
  inputStyle: {
    minWidth: '350px',
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
    minWidth: '350px',
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
  { key: 'Any', text: 'Any', value: 'Any' },
  { key: '5 km', text: '5 km', value: '5 km' },
  { key: '10 km', text: '10 km', value: '10 km' },
  { key: '15 km', text: '15 km', value: '15 km' },
];

function EventSearch({}) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const queryString = location.search;
  const searchParam = new URLSearchParams(queryString);
  const [searchState, setSearchState] = React.useState(0);

  const parsedDate = (dateString, format) => {
    return parse(dateString, format, new Date());
  };
  const postcode = searchParam.has('postcode')
    ? searchParam.get('postcode')
    : '';
  const [keyword, setKeyword] = useState(
    searchParam.has('keyword') ? searchParam.get('keyword') : ''
  );
  const [startDate, setStartDate] = useState(
    searchParam.has('startDate') ? searchParam.get('startDate') : ''
  );
  const [endDate, setEndDate] = useState(
    searchParam.has('endDate') ? searchParam.get('endDate') : ''
  );
  const [range, setRange] = useState(
    searchParam.has('range') ? searchParam.get('range') : 'Any'
  );
  const [format, setFormat] = useState(
    searchParam.has('eventFormat')
      ? searchParam
          .get('eventFormat')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );
  const [category, setCategory] = useState(
    searchParam.has('eventCategory')
      ? searchParam
          .get('eventCategory')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );

  const urlValue = {
    startdate: searchParam.has('startDate')
      ? parsedDate(searchParam.get('startDate'), 'dd/MM/yyyy')
      : '',
    enddate: searchParam.has('endDate')
      ? parsedDate(searchParam.get('endDate'), 'dd/MM/yyyy')
      : '',
    Postcode: searchParam.has('postcode') ? searchParam.get('postcode') : '',
  };

  const { reset, control, handleSubmit } = useForm({
    defaultValues: urlValue,
  });

  const handleSearch = (data) => {
    console.log(data.Postcode);
    const eventFormat = format.map((each) => each.value);
    const eventCategory = category.map((each) => each.value);
    console.log(startDate, endDate);
    const queryData = Object.assign(
      {},
      keyword === '' ? null : { keyword },
      eventFormat.length === 0 ? null : { eventFormat },
      eventCategory.length === 0 ? null : { eventCategory },
      startDate === '' ? null : { startDate },
      endDate === '' ? null : { endDate },
      data.Postcode === '' ? null : { postcode: data.Postcode },
      range === '' ? null : { range }
    );
    const queryPath = new URLSearchParams(queryData).toString();
    console.log(queryPath);
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
    setSearchState(searchState + 1);
  };

  useEffect(() => {
    console.log(
      keyword,
      format.map((each) => each.value),
      category.map((each) => each.value),
      startDate,
      endDate,
      postcode,
      range
    );
  }, [searchState]);

  return (
    <>
      <form onSubmit={handleSubmit(handleSearch)}>
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
                value={keyword}
                onChange={(event, data) => {
                  setKeyword(data.value);
                }}
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
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setStartDate(
                          dateFormat(e, 'dd/MM/yyyy', {
                            awareOfUnicodeTokens: true,
                          })
                        );
                      }}
                      className={classes.pickerStyle}
                    />
                  )}
                  name='startdate'
                  control={control}
                />
              </Box>
            </Box>
            <Box ml={1}>
              <label>End Date: </label>
              <Box>
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setEndDate(
                          dateFormat(e, 'dd/MM/yyyy', {
                            awareOfUnicodeTokens: true,
                          })
                        );
                      }}
                      className={classes.pickerStyle}
                    />
                  )}
                  name='enddate'
                  control={control}
                />
              </Box>
            </Box>
            <Box
              display='flex'
              flexDirection='column'
              style={{ minWidth: '350px' }}
              ml={1}
            >
              <label>Event Location: </label>
              <Box display='flex' width='100%' justifyContent='space-between'>
                <Box flexGrow='1'>
                  <PostalCodeAutoComplete control={control} search/>
                </Box>
                <Box pt={1}>
                  <Dropdown
                    value={range}
                    onChange={(e, { value }) => setRange(value)}
                    options={options}
                    selection
                    style={{ minWidth: '80px', maxHeight: '45px' }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={3}>
            <Button color='teal' type='submit'>
              Search
            </Button>
          </Box>
        </Box>
      </form>
      <EventSearchResult />
    </>
  );
}

export default EventSearch;
