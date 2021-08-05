import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MultiSelect from 'react-multi-select-component';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { searchOrganization } from '../api';
import OrgCard from './OrgCard';

const options = [
  { label: 'Youth', value: 'Youth' },
  { label: 'Seniors', value: 'Seniors' },
  { label: 'Family', value: 'Family' },
  { label: 'Mental Health', value: 'Mental Health' },
  { label: 'Body Health', value: 'Body Health' },
  { label: 'Community', value: 'Community' },
  { label: 'Disability and Carers', value: 'Disability and Carers' },
  { label: 'Education', value: 'Education' },
  { label: 'Employment', value: 'Employment' },
  { label: 'Financial and Legal', value: 'Financial and Legal' },
];

const useStyles = makeStyles({
  container: {
    height: '300px',
    backgroundColor: '#D9F4F2',
  },
  titleStyle: {
    fontSize: '35px',
    fontWeight: 'bold',
  },
  dropDown: {
    minWidth: '350px',
    fontSize: '17px',
  },
  search: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '2%',
    width: '70%',
    // minHeight:'2000px',
    // paddingBottom:'40%',//need be be changed
  },
  itemStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

function OrgSearch() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const queryString = location.search;
  const searchParam = new URLSearchParams(queryString);
  const [searchState, setSearchState] = React.useState(0);
  const [searchResult, setSearchResult] = React.useState([]);

  const [searchType, setSearchType] = useState(
    searchParam.has('orgType')
      ? searchParam
          .get('orgType')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );
  const [keyword, setKeyword] = useState(
    searchParam.has('keyword') ? searchParam.get('keyword') : ''
  );

  const handleSearch = () => {
    const orgType = searchType.map((each) => each.value);
    const queryData = Object.assign(
      {},
      keyword === '' ? null : { keyword },
      orgType.length === 0 ? null : { orgType }
    );

    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/organization/search',
      search: `?${queryPath}`,
    };
    history.push(path);
    setSearchState(searchState + 1);
  };

  const toSearchEvent = () => {
    history.push('/event/search')
  }

  useEffect(() => {
    // reset state and search filter
    const urlKeyword = searchParam.has('keyword')
      ? searchParam.get('keyword')
      : '';
    const typeList = searchParam.has('orgType')
      ? searchParam.get('orgType')
      : [];
    setKeyword(urlKeyword);
    setSearchType(
      typeList.length !== 0
        ? typeList.split(',').map((each) => ({ label: each, value: each }))
        : []
    );
    setSearchResult([]);
    // search with new filter
    const search = async () => {
      const res = await searchOrganization(urlKeyword, typeList);
      if (res[0] === 200) {
        console.log(res[1].organizationId);
        setSearchResult(res[1].organizationId);
      }
    };
    search();
  }, [searchState, location.search]);

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        className={classes.container}
        width='100%'
      >
        <div className={classes.titleStyle}>Find Organization</div>
        <Box mt={5} pl={5} pr={5}>
          <Input
            type='text'
            placeholder='Search...'
            action
            size='large'
            value={keyword}
            className={classes.searchBar}
            onChange={(event, data) => {
              setKeyword(data.value);
            }}
          >
            <input style={{ minWidth: '300px', fontSize: '17px' }} />
            <MultiSelect
              options={options}
              labelledBy='Organization Type'
              value={searchType}
              onChange={setSearchType}
              className={classes.dropDown}
              overrideStrings={{ selectSomeItems: 'Organization Type...' }}
            />
            <Button
              type='submit'
              onClick={handleSearch}
              color='teal'
              style={{ fontSize: '17px' }}
            >
              Search
            </Button>
          </Input>
        </Box>
        <Box mt={5} >
          <Link underline='always' style={{cursor: 'pointer', fontSize:'17px'}} onClick={toSearchEvent}> Want to find events</Link>
        </Box>
      </Box>
      <Grid container className={classes.search} key={location.search}>
        {searchResult.map((item, index) => (
          <Grid
            item
            xs={11}
            md={6}
            lg={4}
            key={index}
            className={classes.itemStyle}
          >
            <OrgCard Id={item} key={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default OrgSearch;
