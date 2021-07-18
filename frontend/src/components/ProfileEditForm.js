import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backgroundStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '10px',
    width: '100%',
    fontFamily: 'Noto Sans',
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '15px',
  },
  buttonStyle: {
    fontSize: '15px',
    marginTop: '20px',
    marginBottom: '10px',
  },
}));

function ProfileEditForm({ preloadedValues }) {
  const classes = useStyles();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues,
  });

  const onSubmit = async (data) => {
      console.log(data)
      reset();
  }

  return (
    <>
      {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : null}
      {successMsg ? <Alert severity='success'>{errorMsg}</Alert> : null}
      <form className={classes.backgroundStyle} onSubmit={handleSubmit(onSubmit)}>
        <section className={classes.formStyle}>
          <label>
            {sessionStorage.getItem('usergroup') === 'individual'
              ? 'Nickname:'
              : 'Organization Name:'}
          </label>
          <Controller
            render={({ field }) => (
              <TextField
                value={field.value || ''}
                onChange={field.onChange}
                inputRef={field.ref}
                variant='outlined'
                size='small'
                margin='dense'
              />
            )}
            name='name'
            control={control}
          />
        </section>
        <section className={classes.formStyle}>
          <label>New Password:</label>
          <Controller
            render={({ field }) => (
              <TextField
                value={field.value || ''}
                onChange={field.onChange}
                inputRef={field.ref}
                variant='outlined'
                size='small'
                margin='dense'
                type='password'
              />
            )}
            name='password'
            control={control}
          />
        </section>
        <section className={classes.formStyle}>
          <label>Confirm Password:</label>
          <Controller
            render={({ field }) => (
              <TextField
                value={field.value || ''}
                onChange={field.onChange}
                inputRef={field.ref}
                variant='outlined'
                size='small'
                margin='dense'
                type='password'
              />
            )}
            name='confirmpassword'
            control={control}
            rules={{
              matchesPreviousPassword: (value) => {
                const { password } = getValues();
                return password === value || 'Passwords should match';
              },
            }}
          />
        </section>
        {errors?.EndDate?.type === 'matchesPreviousPassword' && (
          <Alert severity='error'>{errors.EndDate.message}</Alert>
        )}
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={classes.buttonStyle}
        >
          Save
        </Button>
      </form>
    </>
  );
}

export default ProfileEditForm;
