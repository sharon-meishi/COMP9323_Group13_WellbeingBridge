//ProfileEditForm component: for individual users to edit their nick name and password
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { updateOrganizationProfile, updateUserProfile } from '../Helper/api';

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
    width: '50%',
  },
  buttonStyle: {
    fontSize: '15px',
    marginTop: '20px',
    marginBottom: '10px',
    marginRight: '5px',
  },
  linkStyle: {
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '50%',
    marginTop: '8px',
  },
}));

function ProfileEditForm({ currentName, oId, setOpen, setUpdate }) {
  const classes = useStyles();
  const isUser = sessionStorage.getItem('usergroup') === 'individual'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [show, setShow] = useState(isUser ? false : true);



  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentName,
    },
  });

  const toggleShow = () => {
    setShow(!show);
    setValue('password', '');
    setValue('confirmpassword', '');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const onSubmit = async (data) => {
    const updateProfile = async () => {
      let Data;
      if (oId) {
        const updateBody = {
          organizationName: data.name,
          password: data.password || '',
        };
        Data = await updateOrganizationProfile(oId, updateBody);
      } else {
        const updateBody = {
          Nickname: data.name,
          Password: data.password || '',
        };
        Data = await updateUserProfile(updateBody);
      }
      if (Data[0] === 200) {
        setErrorMsg('')
        setSuccessMsg('Your profile has been updated successfully!');
        reset({ name: data.name });
        sessionStorage.setItem('name', data.name);
        setUpdate(true);
      } else {
        setSuccessMsg('');
        setErrorMsg('Something Wrong, please try again');
      }
    };
    updateProfile();
  };

  return (
    <>
      {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : null}
      {successMsg ? <Alert severity='success'>{successMsg}</Alert> : null}
      <form
        className={classes.backgroundStyle}
        onSubmit={handleSubmit(onSubmit)}
      >
        {sessionStorage.getItem('usergroup') === 'individual' ? (
          <section className={classes.formStyle}>
            <label>Nickname</label>
            <Controller
              render={({ field }) => (
                <TextField
                  value={field.value || ''}
                  onChange={field.onChange}
                  inputRef={field.ref}
                  variant='outlined'
                  size='small'
                  margin='dense'
                  required
                />
              )}
              rules={{required: true, pattern: /^[a-zA-Z0-9_.-]*$/}}
              name='name'
              control={control}
            />
          {errors.name?.type === 'required' && (
            <Alert severity='error'>This field is required.</Alert>
          )}
          {errors.name?.type === 'pattern' && (
            <Alert severity='error'>Invalid username</Alert>
          )}
          </section>
          
        ) : null}
        {isUser ?
        <Link onClick={toggleShow} className={classes.linkStyle}>
          Edit Password 
        </Link> : null}
        {show ? (
          <Box
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
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
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const { password } = getValues();
                      return password === value || 'Passwords should match';
                    },
                  },
                }}
              />
            </section>
            {errors?.confirmpassword && (
              <Alert severity='error'>{errors.confirmpassword.message}</Alert>
            )}
          </Box>
        ) : null}
        <Box display='flex' justifyContent='space-between'>
          {setOpen ? (
            <Button
              variant='outlined'
              color='primary'
              className={classes.buttonStyle}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant='outlined'
              color='primary'
              className={classes.buttonStyle}
              onClick={() => reset()}
            >
              Reset
            </Button>
          )}

          <Button
            type='submit'
            variant='contained'
            color='primary'
            className={classes.buttonStyle}
          >
            Save
          </Button>
        </Box>
      </form>
    </>
  );
}

export default ProfileEditForm;
