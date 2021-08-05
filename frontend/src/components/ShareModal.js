import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const useStyles = makeStyles(() => ({
  modalStyle: {
    minWidth: '300px',
  },
  content:{
    minWidth:'400px',
  },
  textField:{
    minWidth:'350px',
  },
  eventNameStyle: {
    fontWeight: 'bold',
    color: 'black',
  },
}));

function ShareModal({
  open,
  setShare,
  eventId,
}) {
  
  const classes = useStyles();
  const handleClose = () => {
    setShare(false);
  };
  const [urlLink, setUrlLink] = React.useState('');
  React.useEffect(()=>{
    const url = document.URL.replace(/^(http:\/\/.*[0-9]{4}\/).*$/,'$1')+`event/${eventId}`;
    setUrlLink(url);
  },[eventId]);
  
  const handleCopy = async () => {
    // const res = await deleteEvent(eventId);
    // if (res[0] === 200) {
    //   console.log('delete success');
    //   const newEventList = eventList.filter(event => event.eventId !== eventId)
    //   setEventList(newEventList);
    //   setOpen(false);
    // } else {
    //   console.log(res[1]);
    // }
    navigator.clipboard.writeText(urlLink);
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
        <DialogTitle className={classes.content} id='alert-dialog-title'>Share with friends</DialogTitle>
        <DialogContent className={classes.content}>
          {/* <TextField
          id="outlined-bare"
          className={classes.textField}
          
          margin="normal"
          variant="outlined"
          inputProps={{ 'aria-label': 'bare' }}
          /> */}
          <TextField
            id="outlined-adornment-password"
            defaultValue={urlLink}
            className={classes.textField}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="Copy link"
                    onClick={handleCopy}
                  >
                  <Tooltip title="Copy" palcement="start">
                  <FileCopyIcon/>
                  </Tooltip>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <DialogActions>
          {/* <Tooltip title="Copy">
            <Button onClick={handleCopy} variant='outlined' color='primary'>
              Copy Link
            </Button>
          </Tooltip> */}
        </DialogActions>
        </DialogContent>

      </Dialog>
    </div>
  );
}

export default ShareModal;
