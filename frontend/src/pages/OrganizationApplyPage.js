import React, { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NavBar from '../components/NavBar';
import { AppContext } from '../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  backgroundStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30px',
    width: '100%',
    fontFamily: 'Noto Sans',
  },
  GridStyle: {
    width: '100%',
  },
  titleStyle: {
    textAlign: 'center',
    fontWeight: '500',
    textDecoration: 'underline',
    color: '#26A69A',
  },
  centerStyle: {
    marginTop: '5px',
    textAlign: 'center',
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '15px',
  },
  subtitleStyle: {
    fontSize: '18px',
    marginTop: '30px',
    fontWeight: '700',
  },
  buttonStyle: {
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '10px',
    width: '50%',
    alignSelf: 'center',
  },
  selectStyle: {
    marginTop: '8px',
    marginBottom: '4px',
    height: '40px',
  },
}));

function OrganizationApplyPage() {
  const classes = useStyles();
  const context = useContext(AppContext);

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    console.log(data);
  }


  return (
    <>
      <NavBar />
      <Grid container className={classes.backgroundStyle}>
        <Grid
          item
          xs={10}
          sm={8}
          md={6}
          lg={5}
          xl={3}
          className={classes.GridStyle}
        >
          <Typography variant='h5' className={classes.titleStyle}>
            Register your organization
          </Typography>
          <Typography className={classes.centerStyle}>
            (All fields are required)
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.formStyle}
          >
            <Typography className={classes.subtitleStyle}>
              Organization Information:
            </Typography>
            <section className={classes.formStyle}>
              <label>Organization Name:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    variant='outlined'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='OrganizationName'
                control={control}
                rules={{ required: true }}
              />
              {errors?.OrganizationName?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Organization Type:</label>
              <Controller
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      ref={field.ref}
                      variant='outlined'
                      className={classes.selectStyle}
                    >
                      <MenuItem value='Youth'>Youth</MenuItem>
                      <MenuItem value='Disability and carers'>
                        Disability and carers
                      </MenuItem>
                      <MenuItem value='Senior'>Senior</MenuItem>
                      <MenuItem value='Family'>Family</MenuItem>
                      <MenuItem value='Education'>Education</MenuItem>
                      <MenuItem value='Employment'>Employment</MenuItem>
                      <MenuItem value='Body health'>Body health</MenuItem>
                      <MenuItem value='Mental health'>Mental health</MenuItem>
                      <MenuItem value='Money'>Money</MenuItem>
                      <MenuItem value='Legal services'>Legal services</MenuItem>
                    </Select>
                  );
                }}
                defaultValue=''
                name='OrganizationType'
                control={control}
                rules={{ required: true }}
              />
              {errors?.OrganizationType?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>
                Organization Introduction (Less than 50 characters):
              </label>
              <Controller
                render={({ field }) => (
                  <TextField
                    id='outlined-multiline-static'
                    multiline
                    rows={5}
                    variant='outlined'
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='OrganizationIntroduction'
                control={control}
                rules={{ required: true, maxLength: 50 }}
              />
              {errors?.OrganizationIntroduction?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              {errors?.OrganizationIntroduction?.type === 'maxLength' && (
                <Alert severity='error'>
                  This field should be less than 50 characters.
                </Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Contact:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    variant='outlined'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='Contact'
                control={control}
                rules={{ required: true }}
              />
              {errors?.Contact?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <Typography className={classes.subtitleStyle}>
              Account Information:
            </Typography>

            <section className={classes.formStyle}>
              <label>Email:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    variant='outlined'
                    type='email'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='Email'
                control={control}
                rules={{ required: true }}
              />
              {errors?.Email?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Password:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    variant='outlined'
                    type='password'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='Password'
                control={control}
                rules={{ required: true }}
              />
            </section>

            <section className={classes.formStyle}>
              <label>Confirm Password:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    variant='outlined'
                    type='password'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='ConfirmPassword'
                control={control}
                rules={{
                  required: true,
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const { Password } = getValues();
                      return Password === value || 'Passwords should match';
                    },
                  },
                }}
              />
              {errors?.ConfirmPassword && (
                <Alert severity='error'>Passwords should match</Alert>
              )}
            </section>

            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.buttonStyle}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
}

export default OrganizationApplyPage;
