import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Link from '@material-ui/core/link';
import LoginIcon from '../Assets/LoginIcon.svg';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles({
  modalStyle: {
    padding: '40px',
    minWidth: '350px',
  },
  flexStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },

  topStyle: {
    margin: '30px 70px 10px 70px',
  },
  titleStyle: {
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '500',
    margin: '10px 0',
  },
  textFieldStyle: {
    width: '70%',
  },
  buttonStyle: {
    fontSize: '16px',
    marginTop: '20px',
  },
  linkStyle: {
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '400',
  },
});

function LoginModal({ open, setOpenLogin, setOpenRegister }) {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [errorMsg, setErrorMsg] = useState('');
  const [stateCode, setstateCode] = useState(0);

  const handleClose = () => {
    setOpenLogin(false);
  };

  const loginHandeler = (data) => {
    console.log(data);
  };

  useEffect(() => {
    if (stateCode === 200) {
      console.log('login success');
    }
  }, [stateCode]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.modalStyle}
      maxWidth='md'
    >
      <DialogContent className={classes.flexStyle}>
        <Box className={classes.topStyle}>
          <img alt='loginIcon' src={LoginIcon} />
          <Typography
            id='form-dialog-title'
            variant='h6'
            className={classes.titleStyle}
          >
            Welcome Back!
          </Typography>
          <DialogContentText>Log in to your account</DialogContentText>
        </Box>
        {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : null}
        <form className={classes.formStyle} onSubmit={handleSubmit(loginHandeler)}>
          <TextField
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
            })}
            autoFocus
            margin='normal'
            id='email'
            label='Email Address'
            type='email'
            variant='outlined'
            className={classes.textFieldStyle}
            required
          />
          {errors?.emailRegister?.type === 'required' && (
            <error>This field is required</error>
          )}
          {errors?.emailRegister?.type === 'pattern' && (
            <error>Invalid email input</error>
          )}
          <TextField
          {...register("password", {
            required: true
          })}
            autoFocus
            margin='normal'
            id='password'
            label='Password'
            type='password'
            variant='outlined'
            className={classes.textFieldStyle}
            required
          />
          {errors?.password?.type === 'required' && (
            <error>This field is required</error>
          )}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.buttonStyle}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
      <DialogActions className={classes.flexStyle}>
        <Box m={1} className={classes.linkStyle}>
          Don't have an account?
          <Link
            href='#'
            onClick={preventDefault}
            color='inherit'
            underline='always'
          >
            Register here!
          </Link>
          <Box m={1}>
            <Link
              href='#'
              onClick={preventDefault}
              color='inherit'
              underline='always'
            >
              Or apply here to list your organization and events!
            </Link>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default LoginModal;
