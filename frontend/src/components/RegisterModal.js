import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
import RegisterIcon from '../Assets/RegisterIcon.svg';
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
    margin: '30px 60px 10px 60px',
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
    marginBottom: '10px',
  },
  linkStyle: {
    fontSize: '13px',
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '400',
  },
});

function RegisterModal({ open, setOpenLogin, setOpenRegister }) {
  const classes = useStyles();
  const history = useHistory();

  const preventDefault = (event) => event.preventDefault();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState('');
  const [stateCode, setstateCode] = useState(0);

  const handleClose = () => {
    setOpenRegister(false);
  };

  const loginHandeler = (data) => {
    console.log(data);
  };

  const handleSwitch = (event) => {
    event.preventDefault();
    reset();
    setOpenRegister(false);
    setOpenLogin(true);
  };

  const toOrganizationApplyPage = (event) => {
    event.preventDefault();
    reset();
    setOpenRegister(false);
    history.push('/organization/apply');
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
          <img alt='RegisterIcon' src={RegisterIcon} />
          <Typography
            id='form-dialog-title'
            variant='h6'
            className={classes.titleStyle}
          >
            Welcome to Wellbeing Bridge!
          </Typography>
          <DialogContentText>Create your account</DialogContentText>
        </Box>
        {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : null}
        <form
          className={classes.formStyle}
          onSubmit={handleSubmit(loginHandeler)}
        >
          <TextField
            {...register('Nickname', {
              required: true,
            })}
            autoFocus
            margin='normal'
            id='nickname'
            label='Nickname'
            type='text'
            variant='outlined'
            className={classes.textFieldStyle}
            required
          />
          {errors?.Nickname?.type === 'required' && (
            <error>This field is required</error>
          )}
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
            Already have an account?
            <Link
              href='#'
              onClick={handleSwitch}
              color='inherit'
              underline='always'
            >
              Login here!
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
      <DialogActions className={classes.flexStyle}></DialogActions>
    </Dialog>
  );
}

export default RegisterModal;
