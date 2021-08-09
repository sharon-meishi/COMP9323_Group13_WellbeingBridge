//Logo Button component: Logo on the top left, back to home page when clicking  
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import icon from '../../Assets/WellbeingBridgeLogo.png';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '200px',
    height: '41px',
  },
}));

function LogoButton() {
  const history = useHistory();
  const classes = useStyles();
  const toHomePage = () => {
    history.push('/home');
  };

  return (
    <Button onClick={toHomePage}>
      <Avatar alt='WellbeingBridgeLogo' src={icon} className={classes.image} />
    </Button>
  );
}

export default LogoButton;
