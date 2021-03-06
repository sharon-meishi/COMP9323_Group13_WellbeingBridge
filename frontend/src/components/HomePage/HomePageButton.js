//HomePageButton component: Find organization and More event button layout
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const StyledButton = withStyles({
  root: {
    background: '#216991',
    fontSize: '15px',
    '&:hover': { 
      background: '#FFF',
      color: '#216991',
    },
    fontFamily: `'Noto Sans', 'Roboto'`,
  },
  label: {
    textTransform: 'none',
  },
})(Button);

function HomePageButton({ text, onClick }) {
  return (
    <StyledButton variant='contained' color='primary' onClick={onClick}>
      {text}
    </StyledButton>
  );
}

export default HomePageButton;
