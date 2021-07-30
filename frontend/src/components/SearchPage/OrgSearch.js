import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Input } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import OrgSearchResult from './OrgSearchResult';
import MultiSelect from 'react-multi-select-component';

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
});

function OrgSearch() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const queryString = location.search;
  const searchParam = new URLSearchParams(queryString);
  const [searchState, setSearchState] = React.useState(0)

  const typeList = searchParam.has('type') ? searchParam.get('type') : []

  const [searchType, setSearchType] = useState(
    searchParam.has('type')
      ? searchParam
          .get('type')
          .split(',')
          .map((each) => ({ label: each, value: each }))
      : []
  );
  const [keyword, setKeyword] = useState(
    searchParam.has('keyword') ? searchParam.get('keyword') : ''
  );

  const handleSearch = () => {
    const type = searchType.map((each) => each.value);
    console.log(keyword, type);
    const queryData = Object.assign(
      {},
      keyword === '' ? null : { keyword },
      type.length === 0 ? null : { type }
    );

    const queryPath = new URLSearchParams(queryData).toString();
    console.log()
    const path = {
      pathname: '/organization/search',
      search: `?${queryPath}`,
    };
    history.push(path);
    setSearchState(searchState+1)
  };

  useEffect(() => {
    console.log(keyword, typeList);
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
      <OrgSearchResult />
    </>
  );
}

export default OrgSearch;
