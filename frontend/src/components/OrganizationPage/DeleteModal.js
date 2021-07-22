import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { deleteEvent } from '../api';

const useStyles = makeStyles(() => ({
  modalStyle: {
    minWidth: '500px',
  },
  eventNameStyle: {
    fontWeight: 'bold',
    color: 'black',
  },
}));

function DeleteModal({
  open,
  setOpen,
  eventId,
  eventName,
  eventList,
  setEventList,
}) {
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const res = await deleteEvent(eventId);
    if (res[0] === 200) {
      console.log('delete success');
      const newEventList = eventList.filter(event => event.eventId !== eventId)
      setEventList(newEventList);
      setOpen(false);
    } else {
      console.log(res[1]);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        className={classes.modalStyle}
      >
        <DialogTitle id='alert-dialog-title'>Delete your event</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete event{' '}
            <span className={classes.eventNameStyle}>'{eventName}'</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='primary'>
            No
          </Button>
          <Button onClick={handleDelete} variant='contained' color='secondary'>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DeleteModal;
