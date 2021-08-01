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
import dateFormat from 'date-fns/Format';
import parse from 'date-fns/parse';
import 'react-datepicker/dist/react-datepicker.css';
import { searchEvent } from '../api';

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

const FormatOptions = [
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

function EventSearch() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const queryString = location.search;
  const searchParam = new URLSearchParams(queryString);
  const [searchState, setSearchState] = React.useState(0);
  const [resultList, setresultList] = React.useState([]);

  const parsedDate = (dateString, Format) => {
    return parse(dateString, Format, new Date());
  };
  const postcode = searchParam.has('postcode')
    ? searchParam.get('postcode')
    : '';
  const [keyword, setKeyword] = useState(
    searchParam.has('keyword') ? searchParam.get('keyword') : ''
  );
  const [startdate, setstartdate] = useState(
    searchParam.has('startdate') ? searchParam.get('startdate') : ''
  );
  const [enddate, setenddate] = useState(
    searchParam.has('enddate') ? searchParam.get('enddate') : ''
  );
  const [range, setRange] = useState(
    searchParam.has('range') ? searchParam.get('range') : 'Any'
  );
  const [Format, setFormat] = useState(
    searchParam.has('format')
      ? searchParam
          .get('format')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );
  const [Category, setCategory] = useState(
    searchParam.has('category')
      ? searchParam
          .get('category')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );

  const urlValue = {
    startdate: searchParam.has('startdate')
      ? parsedDate(searchParam.get('startdate'), 'dd/MM/yyyy')
      : '',
    enddate: searchParam.has('enddate')
      ? parsedDate(searchParam.get('enddate'), 'dd/MM/yyyy')
      : '',
    Postcode: searchParam.has('postcode') ? searchParam.get('postcode') : '',
  };

  const { control, handleSubmit } = useForm({
    defaultValues: urlValue,
  });

  const handleSearch = async (data) => {
    console.log(data.Postcode);
    const format = Format.map((each) => each.value);
    const category = Category.map((each) => each.value);
    console.log(startdate, enddate);
    const queryData = Object.assign(
      {},
      keyword === '' ? null : { keyword },
      format.length === 0 ? null : { format },
      category.length === 0 ? null : { category },
      startdate === '' ? null : { startdate },
      enddate === '' ? null : { enddate },
      data.Postcode === '' ? null : { postcode: data.Postcode },
      range === 'Any' ? null : { range }
    );
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}&lat=-33.884895&lng=151.135696`,
    };
    history.push(path);
    setSearchState(searchState + 1);

    navigator.geolocation.getCurrentPosition(position => {
      const a = position.coords;
      console.log('sss',a);
      // Show a map centered at latitude / longitude.
    });

    const res = await searchEvent(path.search);
    if (res[0] === 200) {
      console.log(res[1]);
      setresultList(res[1]);
    }
  };

  useEffect(() => {
    console.log(
      keyword,
      Format.map((each) => each.value),
      Category.map((each) => each.value),
      startdate,
      enddate,
      postcode,
      range
    );
  }, [Category, enddate, Format, keyword, postcode, range, searchState, startdate]);

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
                options={FormatOptions}
                value={Format}
                onChange={setFormat}
                labelledBy='Select'
                className={classes.selectStyle}
              />
            </Box>
            <Box ml={1}>
              <label>Event Category: </label>
              <MultiSelect
                options={categoryOptions}
                value={Category}
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
                        setstartdate(
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
                        setenddate(
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
      <EventSearchResult result={resultList} />
    </>
  );
}

export default EventSearch;
