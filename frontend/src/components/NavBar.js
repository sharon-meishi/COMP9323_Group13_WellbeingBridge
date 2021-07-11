import React, { useState, useContext } from 'react';
import { AppContext } from '../utils/store';
import ProfileMenu from './ProfileMenu';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import icon from '../Assets/WellbeingBridgeLogo.png';
import {
  FormControl,
  MenuItem,
  Select,
  InputBase,
  Button,
  Avatar,
  Link,
  Box
} from '@material-ui/core';
import HomePageButton from './HomePageButton';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

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
    textAlign: 'center',
  },
  image: {
    width: '200px',
    height: '40px',
  },
  border: {
    borderBottom: 'solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 10px 10px 30px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  leftBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    },
  },
  searchBox: {
    border: '2px solid #E5E5E5',
    height: '32px',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '10px',
    borderRadius: '5px',
  },
  select: {
    width: '130px',
  },
  input: {
    borderLeft: 'solid rgba(0, 0, 0, 0.18)',
    paddingLeft: '5px',
    width: '250px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '5px',
      width: '150px',
    },
  },
  search: {
    marginTop: '5px',
    cursor: 'pointer',
  },
  button: {
    marginRight: '20px',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const history = useHistory();
  
  const context = useContext(AppContext);


  const [type, settype] = React.useState('organization');
  const handleChange = (event) => {
    settype(event.target.value);
  };

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleClickOpen = () => {
    setOpenLogin(true);
  };

  const toOrganizationApplyPage = (event) => {
    event.preventDefault();
    history.push('/organization/apply');
  };

  const toHomePage = () => {
    history.push('/home');
  };


  return (
    <div className={classes.root}>
      {openLogin ? (
        <LoginModal
          open={openLogin}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      {openRegister ? (
        <RegisterModal
          open={openRegister}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      <Box className={classes.title}>
        <Link href='#' onClick={toOrganizationApplyPage} underline='always' color='inherit'>
          Want to list your organization and events? Apply here!
        </Link>
      </Box>

      <div className={classes.border}>
        <div className={classes.leftBox}>
          <Button onClick={toHomePage}>
            <Avatar
              alt='WellbeingBridgeLogo'
              src={icon}
              className={classes.image}
            />
          </Button>
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
        {context.isLoginState ? (
          null
        ):
        <HomePageButton text='LOGIN' onClick={handleClickOpen} />
        }
        {context.isLoginState ? <ProfileMenu nickname={sessionStorage.getItem('nickname')}/>: null}
        
      </div>
    </div>
  );
}
