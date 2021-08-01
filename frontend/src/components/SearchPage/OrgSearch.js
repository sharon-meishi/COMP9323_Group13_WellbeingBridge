import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
// import OrgSearchResult from './OrgSearchResult';
import MultiSelect from 'react-multi-select-component';
import Grid from '@material-ui/core/Grid';
import {searchOrganization} from '../api';
import OrgCard from './OrgCard';

const options = [
  { label: 'Youth', value: 'Youth' },
  { label: 'Senior', value: 'Senior' },
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
    minWidth: '200px',
  },
  search:{
    display:'flex',
    justifyContent:'space-evenly',
    flexWrap:'wrap',
    margin:'2%',
    alignItem:'center',
    // minHeight:'2000px',
    // paddingBottom:'40%',//need be be changed

  }
});

function OrgSearch() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  console.log(`location=${location}`);
  const queryString = location.search;
  console.log(`queryString=${queryString}`);
  const searchParam = new URLSearchParams(queryString);
  console.log(`searchParam=${searchParam}`);
  const [searchState, setSearchState] = React.useState(0);
  const [searchResult, setSearchResult] = React.useState([]);
  const typeList = searchParam.has('orgType') ? searchParam.get('orgType') : []

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
    console.log(keyword, orgType);
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
    setSearchState(searchState+1)
  };

  useEffect(() => {
    console.log(keyword, typeList);
    console.log(typeof(keyword));
    console.log(typeof(typeList));
    const search = async ()=>{
      const res=  await searchOrganization(keyword, typeList);
      console.log(res[0]);
      if (res[0] === 200){
        console.log(res[1].organizationId);
        setSearchResult(res[1].organizationId);
      }
    }
    search();
  }, [searchState]);

  return (
    <>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        className={classes.container}
      >
        <div className={classes.titleStyle}>Find Organization</div>
        <Box mt={5} pl={5} pr={5}>
          <Input
            type='text'
            placeholder='Search...'
            action
            size='large'
            value={keyword}
            onChange={(event, data) => {
              setKeyword(data.value);
            }}
          >
            <input />
            <MultiSelect
              shouldToggleOnHover
              options={options}
              labelledBy='Organization Type'
              value={searchType}
              onChange={setSearchType}
              className={classes.dropDown}
              overrideStrings={{ selectSomeItems: 'Organization Type...' }}
            />
            <Button type='submit' onClick={handleSearch} color='teal'>
              Search
            </Button>
          </Input>
        </Box>
      </Box>
      <Grid className={classes.search}>
            {searchResult.map((item,index)=>
                <OrgCard Id={item} key={index}></OrgCard>)}
      </Grid>
    </>
  );
}

export default OrgSearch;
