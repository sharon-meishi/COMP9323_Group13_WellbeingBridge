import React, { useState, useContext } from 'react';
import { AppContext } from '../../utils/store';
import ProfileMenu from './ProfileMenu';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import HomePageButton from '../HomePageButton';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import LogoButton from './LogoButton';
import Searchbar from '../Searchbar'


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
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row',
    padding: '3px 10px 3px 30px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  leftBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
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

export default function NavBar({search}) {
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AppContext);

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const handleClickOpen = () => {
    setOpenLogin(true);
  };

  const toOrganizationApplyPage = (event) => {
    event.preventDefault();
    history.push('/organization/apply');
  };

  const toCreateEvent = () => {
    history.push('/event/create');
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
        <Link
          href='#'
          onClick={toOrganizationApplyPage}
          underline='always'
          color='inherit'
        >
          Want to list your organization and events? Apply here!
        </Link>
      </Box>

      <div className={classes.border}>
        <div className={classes.leftBox}>
          <LogoButton />
          <Box ml={2}>
            {search ? null : <Searchbar defaultValue='organization'/>} 
          
          </Box>
        </div>
        <Box display='flex' alignItems='center' mt={1} mb={1}>
          {context.isLoginState ? null : (
            <HomePageButton text='LOGIN' onClick={handleClickOpen} />
          )}
          {sessionStorage.getItem('usergroup') === 'organization' ? (
            <HomePageButton text='NEW EVENT' onClick={toCreateEvent} />
          ) : null}
          {context.isLoginState ? <ProfileMenu /> : null}
        </Box>
      </div>
    </div>
  );
}
