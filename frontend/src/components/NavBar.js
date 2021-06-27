import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import icon from '../Assets/WellbeingBridgeLogo.png';
import { FormControl, MenuItem, Select, InputBase } from '@material-ui/core';
import HomePageButton from './HomePageButton';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    backgroundColor: '#C5EDE9',
    paddingTop: '15px',
    paddingBottom: '15px',
    fontFamily: 'Noto Sans',
    fontSize: '20px',
    fontWeight: 400,
    textDecoration: 'underline',
    textAlign: 'center',
  },
  image: {
    width: '200px',
    height: '40px',
    backgroundImage: `url(${icon})`,
    backgroundRepeat: 'no-repeat',
  },
  border: {
    borderBottom: 'solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 50px 10px 50px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  leftBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  searchBox: {
    border: '2px solid #E5E5E5',
    height: '32px',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '10px',
    borderRadius: '5px'
  },
  select: {
    width: '130px',
  },
  input: {
    borderLeft: 'solid rgba(0, 0, 0, 0.18)',
    paddingLeft: '5px',
    width: '250px',
    [theme.breakpoints.down('sm')]:{
        fontSize: '5px',
        width:'150px'
    }
  },
  search: {
    marginTop: '5px',
    cursor: 'pointer'
  },
  button: {
    marginRight: '20px',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [type, settype] = React.useState('organization');
  const handleChange = (event) => {
    settype(event.target.value);
  };
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        Want to list your organization and events? Apply here!
      </div>
      <div className={classes.border}>
        <div className={classes.leftBox}>
          <div className={classes.image} />
          <div className={classes.searchBox}>
            <FormControl className={classes.select}>
              <Select value={type} onChange={handleChange} defaultValue={type}>
                <MenuItem value='organization'>Organization</MenuItem>
                <MenuItem value='event'>Event</MenuItem>
              </Select>
            </FormControl>
            <InputBase
              className={classes.input}
              placeholder={'Find event or organization...'}
            />
              <SearchIcon className={classes.search} />
          </div>
        </div>
        <HomePageButton text='LOGIN' />
      </div>
    </div>
  );
}
