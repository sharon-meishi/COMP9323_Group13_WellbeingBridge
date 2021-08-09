//Register component: register board for individual  users 
import React, { useState, useContext } from 'react';
import { AppContext } from '../../utils/store';
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
import RegisterIcon from '../../Assets/RegisterIcon.svg';
import MuiAlert from '@material-ui/lab/Alert';
import { registerRequest } from '../api';

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

  const context = useContext(AppContext);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    setOpenRegister(false);
  };

  const registerHandeler = async (data) => {
    const res = await registerRequest(data);
    if (res[0] === 200) {
      reset();
      handleClose();
      setErrorMsg('');
      sessionStorage.setItem('token', res[1].token);
      sessionStorage.setItem('name', data.nickname);
      sessionStorage.setItem('id', res[1].userid);
      sessionStorage.setItem('usergroup', 'individual');
      context.setIsLoginState(true);
    } else {
      setErrorMsg(res[1]);
    }
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
          <DialogContentText>Create your individual account</DialogContentText>
        </Box>
        {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : null}
        <form
          className={classes.formStyle}
          onSubmit={handleSubmit(registerHandeler)}
        >
          <TextField
            {...register('nickname', {
              required: true,
              pattern: /^[a-zA-Z0-9_.-]*$/
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
          {errors?.nickname?.type === 'required' && (
            <Alert severity='error'>This field is required</Alert>
          )}
          {errors?.nickname?.type === 'pattern' && (
            <Alert severity='error'>Invalid username</Alert>
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
            <Alert severity='error'>This field is required</Alert>
          )}
          {errors?.emailRegister?.type === 'pattern' && (
            <Alert>Invalid email input</Alert>
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
            <Alert severity='error'>This field is required</Alert>
          )}
          <TextField
            {...register('passwordConfirmation', {
              required: true,
              validate: {
                matchesPreviousPassword: (value) => {
                  const { password } = getValues();
                  return password === value || 'Passwords should match';
                },
              },
            })}
            autoFocus
            margin='normal'
            id='passwordConfirm'
            label='Confirm Password'
            type='password'
            variant='outlined'
            className={classes.textFieldStyle}
            required
          />
          {errors?.passwordConfirmation && (
            <Alert severity='error'>
              {errors.passwordConfirmation.message}
            </Alert>
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
