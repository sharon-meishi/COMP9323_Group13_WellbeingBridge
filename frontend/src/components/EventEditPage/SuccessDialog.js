import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
  titleStyle: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  iconStyle: {
    height: '100px',
    width: '100px',
    color: '#26A69A',
  },
  actionsStyle: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

function SuccessDialog({ eventId, oId, open, setOpen, message }) {
  const history = useHistory();
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  const backToHome = () => {
    history.push('/home');
  };

  const backToDashboard = () => {
    history.push('/dashboard');
  };

  const toEventPage = () => {
    history.push(`/event/${eventId}`);
  };

  const toOrgPage = () => {
    history.push(`/organization/${oId}`);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box id='alert-dialog-title' className={classes.titleStyle}>
        <CheckCircleOutlineIcon className={classes.iconStyle} />
      </Box>
      <Box m={3}>
        <Typography variant='subtitle1'>{message}</Typography>
      </Box>
      <DialogActions className={classes.actionsStyle}>
        {eventId ? (
          <Button onClick={toEventPage} variant='outlined' color='primary'>
            To Event Page
          </Button>
        ) : null}
        {oId ? (
          <Button onClick={toOrgPage} variant='contained' color='primary'>
            To Organization Page
          </Button>
        ) : (
          <Button onClick={backToDashboard} variant='outlined' color='primary'>
            Back to Dashboard
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default SuccessDialog;
