import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import MultiSelect from 'react-multi-select-component';
import { Input, Button, Dropdown } from 'semantic-ui-react';
import EventSearchResult from './EventSearchResult';
import DatePicker from 'react-datepicker';
import dateFormat from 'date-fns/Format';
import parse from 'date-fns/parse';
import 'react-datepicker/dist/react-datepicker.css';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
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
  { key: '5 km', text: '5 km', value: '5' },
  { key: '10 km', text: '10 km', value: '10' },
  { key: '15 km', text: '15 km', value: '15' },
];

function EventSearch() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const queryString = location.search;
  const searchParam = new URLSearchParams(queryString);
  const [searchState, setSearchState] = useState(0);
  const [resultList, setresultList] = useState([]);
  const [center, setCenter] = useState({lat: '', lng: ''})

  // parse Date value to 'dd/mm/yyyy' date string
  const parsedDate = (dateString, Format) => {
    return parse(dateString, Format, new Date());
  };

  // prefill data from url
  const [keyword, setKeyword] = useState(
    searchParam.has('keyword') ? searchParam.get('keyword') : ''
  );
  const [startdate, setstartdate] = useState(
    searchParam.has('startdate') ? searchParam.get('startdate') : ''
  );
  const [enddate, setenddate] = useState(
    searchParam.has('enddate') ? searchParam.get('enddate') : ''
  );
  const [address, setAddress] = useState(
    searchParam.has('address') ? searchParam.get('address') : ''
  );
  const [range, setRange] = useState(
    searchParam.has('range') ? searchParam.get('range') : '5'
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

  // prepare prefill data for useform
  const urlValue = {
    startdate: searchParam.has('startdate')
      ? parsedDate(searchParam.get('startdate'), 'dd/MM/yyyy')
      : '',
    enddate: searchParam.has('enddate')
      ? parsedDate(searchParam.get('enddate'), 'dd/MM/yyyy')
      : '',
    Postcode: searchParam.has('postcode') ? searchParam.get('postcode') : '',
    address: {label: address, value: address}
  };

  const { control, handleSubmit } = useForm({
    defaultValues: urlValue,
  });

  const toOrgSearch = () => {
    history.push('/organization/search')
  }

  const setLatLng = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setCenter({
          lat: lat,
          lng: lng
        })
        const locationQuery = `${queryString}&lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`;
        fetchData(locationQuery);
      });
  };

  const handleSearch = async (data) => {
    const queryAddress = data.address ? data.address.label : ''
    const format = Format.map((each) => each.value);
    const category = Category.map((each) => each.value);
    const queryData = Object.assign(
      {},
      keyword === '' ? null : { keyword },
      format.length === 0 ? null : { format },
      category.length === 0 ? null : { category },
      startdate === '' ? null : { startdate },
      enddate === '' ? null : { enddate },
      queryAddress === '' ? null : { address : queryAddress },
      range === '' ? null : { range },
    );
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
    setSearchState(searchState + 1);
  };

  const fetchData = async (q) => {
    const res = await searchEvent(q);
    if (res[0] === 200) {
      console.log(res[1]);
      setresultList(res[1]);
    }
  };

  useEffect(() => {
    console.log(`queryString=${queryString}`);
    // reset state after query string have change
    setresultList([]);
    setKeyword(searchParam.has('keyword') ? searchParam.get('keyword') : '');
    setstartdate(
      searchParam.has('startdate') ? searchParam.get('startdate') : ''
    );
    setenddate(searchParam.has('enddate') ? searchParam.get('enddate') : '');
    setAddress(searchParam.has('address') ? searchParam.get('address') : '')
    setRange(searchParam.has('range') ? searchParam.get('range') : '5');
    setFormat(
      searchParam.has('format')
        ? searchParam
            .get('format')
            .split(',')
            .map((each) => ({ label: each, value: each }))
        : []
    );
    setCategory(
      searchParam.has('category')
        ? searchParam
            .get('category')
            .split(',')
            .map((each) => ({ label: each, value: each }))
        : []
    );
    // navigator.geolocation.getCurrentPosition(position => {
    //   const a = position.coords;
    //   console.log('sss',a);
    //   // Show a map centered at latitude / longitude.
    // });
    // if have location 
    if(searchParam.has('address')){
      setLatLng(searchParam.get('address'))
    }else{
      fetchData(queryString);
    }
  }, [searchState, location.search]);

  return (
    <>
      <form onSubmit={handleSubmit(handleSearch)}>
        <Box className={classes.search}>
          <Box className={classes.titleStyle} mt={3} mb={3}>
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
                <Box flexGrow='1' pt={1}>
                  <Controller
                    render={({ field }) => (
                      <GooglePlacesAutocomplete
                        selectProps={{
                          value: field.value,
                          onChange: field.onChange,
                          placeholder: 'Your address...',
                          isClearable: true,
                          defaultValue: {
                            label: address,
                            value: address,
                          }
                        }}
                        minLengthAutocomplete={3}
                      />
                    )}
                    name='address'
                    control={control}
                  />
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
          <Box mt={2}>
            <Button color='teal' type='submit'>
              Search
            </Button>
          </Box>
          <Box mt={1}><Link onClick={toOrgSearch} style={{cursor: 'pointer'}}>Want to find organization?</Link></Box>
        </Box>
      </form>
      <EventSearchResult key={location.search} result={resultList} address={address} center={center}/>
    </>
  );
}

export default EventSearch;
