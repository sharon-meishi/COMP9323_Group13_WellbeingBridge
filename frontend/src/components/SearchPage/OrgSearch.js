import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Button, Input } from 'semantic-ui-react';
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
  }
});

function OrgSearch() {
  const classes = useStyles();
  const [type, setType] = useState([]);

  const handleSearch = () => {
    console.log(type);
  };

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
          <Input type='text' placeholder='Search...' action size='large'>
            <input />
            <MultiSelect
             shouldToggleOnHover
              options={options}
              labelledBy="Organization Type"
              value={type}
              onChange={setType}
              className={classes.dropDown}
              overrideStrings={{selectSomeItems: 'Organization Type...'}}
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
