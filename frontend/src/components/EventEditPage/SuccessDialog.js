import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    titleStyle: {
        display: 'flex',
        justifyContent:'center',
        marginTop: '10px'
    },
    iconStyle: {
        height: '100px',
        width: '100px',
        color: '#26A69A'
    }
}))


function SuccessDialog({ open, setOpen, message, onClick, }) {
    const history = useHistory();
    const classes = useStyles();
    const handleClose = () => {
      setOpen(false);
    };

    const backToHome = () => {
      history.push('/home');
    }

    const backToProfile = () => {
      history.push(`/profile/${sessionStorage.getItem('id')}`);
    }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box id='alert-dialog-title' className={classes.titleStyle}>
      <CheckCircleOutlineIcon className={classes.iconStyle}/>
      </Box>
      <Box m={3}>
           <Typography variant='subtitle1'>{message}</Typography> 
      </Box>
      <DialogActions>
        <Button onClick={backToHome} color='primary' >
          Back to HomePage
        </Button>
        <Button onClick={backToProfile} color='primary' >
          Back to MyProfile
        </Button>

      </DialogActions>
    </Dialog>
  );
}

export default SuccessDialog;
