import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    background: '#216991',
    fontSize: '16px',
    '&:hover': {
      background: '#FFF',
      color: '#216991',
    },
  },
  label: {
    textTransform: 'none',
  },
})(Button);

function HomePageButton({text, onClick}) {
  return (
    <StyledButton variant='contained' color='primary' onClick={onClick}>
      {text}
    </StyledButton>
  );
}

export default HomePageButton;
