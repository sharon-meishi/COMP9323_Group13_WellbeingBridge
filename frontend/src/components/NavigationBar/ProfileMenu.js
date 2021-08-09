//Profile menu component: 
  //different functions for individual users and organization users when clicking Avatar
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../utils/store';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

function ProfileMenu() {
  const history = useHistory();
  const context = useContext(AppContext);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    context.setIsLoginState(false);
    sessionStorage.clear();
    history.push(`/home`);
  };

  const toMyProfile = () => {
    history.push('/profile');
  };

  const toDashBoard = () => {
    history.push('/dashboard');
  };

  const toOrgPage = () =>{
    history.push(`/organization/${sessionStorage.getItem('id')}`)
  }
  return (
    <div>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <Avatar>{sessionStorage.getItem('name').charAt(0).toUpperCase()}</Avatar>
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {sessionStorage.getItem('usergroup') === 'individual' ? (
          <MenuItem onClick={toMyProfile}>Profile</MenuItem>
        ) : (
          <>
          <MenuItem onClick={toOrgPage}>My Page</MenuItem>
          <MenuItem onClick={toDashBoard}>Dashboard</MenuItem>
          </>
        )}

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default ProfileMenu;
