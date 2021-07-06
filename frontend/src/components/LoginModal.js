import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Link from '@material-ui/core/link';
import LoginIcon from '../Assets/LoginIcon.svg';
import MuiAlert from '@material-ui/lab/Alert';
import { loginRequest } from './api'

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
    marginBottom: '10px'
  },
  linkStyle: {
    fontSize: '13px',
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '400',
  },
});

function LoginModal({ open, setOpenLogin, setOpenRegister }) {
  const classes = useStyles();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setOpenLogin(false);
  };

  const loginHandeler = async (data) => {
    console.log(data);
    const res = await loginRequest(data)
    if (res[0] === 200){
      console.log('login success')
      console.log(res)
      sessionStorage.setItem('token', res[1].token);
      sessionStorage.setItem('userId', res[1].usergroup);
      sessionStorage.setItem('usergroup', res[1].individual)
    } else {
      setErrorMsg(res[1])
    }

  };

  const handleSwitch = (event) => {
    event.preventDefault();
    reset();
    setOpenLogin(false); 
    setOpenRegister(true)
  }

  const toOrganizationApplyPage = (event) => {
    event.preventDefault();
    reset();
    setOpenLogin(false);
    history.push('/organization/apply');
  };


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
        <form
          className={classes.formStyle}
          onSubmit={handleSubmit(loginHandeler)}
        >
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
            {...register('password', {
              required: true,
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
          <Box m={1} className={classes.linkStyle}>
            Don't have an account?
            <Link
              href='#'
              onClick={handleSwitch}
              color='inherit'
              underline='always'
            >
              Register here!
            </Link>
            <Box m={1}>
              <Link
                href='#'
                onClick={toOrganizationApplyPage}
                color='inherit'
                underline='always'
              >
                Or apply here to list your organization and events!
              </Link>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
