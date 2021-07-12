import React, { useState, useContext, useEffect } from 'react';
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
import Checkbox from '@material-ui/core/Checkbox';
import PostalCodeAutoComplete from '../components/PostalCodeAutoComplete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ImageUpload from '../components/ImageUpload';
import { storage } from '../components/firebase';
import placeholder from '../Assets/placeholder.png';
import format from "date-fns/format";

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
    fontSize: '40px',
    fontWeight: '500',
    color: '#26A69A',
  },
  centerStyle: {
    fontSize: '12px',
    fontWeight: '700',
  },
  halfStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '15px',
    width: '45%',
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
  pickerStyle: {
    height: '30px',
    fontSize: '15px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    padding: '5px 8px',
    marginTop: '8px',
  },
  checkBoxStyle: {
    display: 'flex',
    paddingTop: '15px',
    alignItems: 'center',
  },
  previewStyle: {
    height: '300px',
    display: 'flex',
    marginTop: '8px',
    padding: '10px',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    justifyContent: 'center',
  },
  imgStyle: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
}));

function EventEditPage(props) {
  const classes = useStyles();
  const context = useContext(AppContext);

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const eventId = props.match.params.eventId;
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setsuccessMsg] = useState('')
  const [onlineEvent, setOnlineEvent] = useState(false);
  const [data, setData] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  

  const [{ alt, src }, setImg] = useState({
    alt: 'Upload an Img',
    src: placeholder,
  });
  const [file, setFile] = useState(null);
  const [url, setURL] = useState('');
  const hanleImgChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setImg({
        alt: e.target.files[0].name,
        src: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const hanleUpload = async () => {
    const ref = storage.ref(`/images/${file.name}`);
    const uploadTask = ref.put(file);
    uploadTask.on('state_changed', console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        setFile(null);
        setURL(url);
      });
    });
  };


  const onSubmit = async (data) => {
    console.log(data);
    setData(data)
    hanleUpload();
  };

  useEffect(()=> {
    if(url){
      console.log(url)
    }
    // send event information to backend
  }, [url])

  useEffect(() => {
    reset();
  }, []);

  console.log(onlineEvent);

  return (
    <>
      <NavBar />
      <Grid container className={classes.backgroundStyle}>
        <Grid
          item
          xs={10}
          sm={10}
          md={8}
          lg={7}
          xl={6}
          className={classes.GridStyle}
        >
          <Typography variant='h5' className={classes.titleStyle}>
            {eventId ? 'Edit your event' : 'Create a new event'}
          </Typography>
          <hr />
          <Typography className={classes.centerStyle}>
            All fields are required unless stated
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className={classes.formStyle}>
            <Typography className={classes.subtitleStyle}>
              Event Information:
            </Typography>
            <section className={classes.formStyle}>
              <label>Event Name (Less than 50 characters):</label>
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
                name='EventName'
                control={control}
                rules={{ required: true, maxLength: 200 }}
              />
              {errors?.EventName?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              {errors?.EventName?.type === 'maxLength' && (
                <Alert severity='error'>
                  This field should be less than 50 characters.
                </Alert>
              )}
            </section>

            <section className={classes.halfStyle}>
              <label>Event Format:</label>
              <Controller
                render={({ field }) => {
                  return (
                    <Select
                      value={field.value || ''}
                      onChange={field.onChange}
                      ref={field.ref}
                      variant='outlined'
                      className={classes.selectStyle}
                    >
                      <MenuItem value='Class'>Class</MenuItem>
                      <MenuItem value='Conference'>Conference</MenuItem>
                      <MenuItem value='Festival'>Festival</MenuItem>
                      <MenuItem value='Party'>Party</MenuItem>
                      <MenuItem value='Expo'>Expo</MenuItem>
                      <MenuItem value='Game'>Game</MenuItem>
                      <MenuItem value='Networking'>Networking</MenuItem>
                      <MenuItem value='Race'>Race</MenuItem>
                      <MenuItem value='Seminar'>Seminar</MenuItem>
                      <MenuItem value='Tour'>Tour</MenuItem>
                    </Select>
                  );
                }}
                name='EventFormat'
                control={control}
                rules={{ required: true }}
              />
              {errors?.EventFormat?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Event Introduction (Less than 200 characters):</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    multiline
                    rows={5}
                    variant='outlined'
                    value={field.value || ''}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    size='small'
                    margin='dense'
                  />
                )}
                name='EventIntroduction'
                control={control}
                rules={{ required: true, maxLength: 200 }}
              />
              {errors?.EventIntroduction?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              {errors?.EventIntroduction?.type === 'maxLength' && (
                <Alert severity='error'>
                  This field should be less than 200 characters.
                </Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Event Details:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    multiline
                    rows={5}
                    variant='outlined'
                    value={field.value || ''}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    size='small'
                    margin='dense'
                  />
                )}
                name='EventDetails'
                control={control}
                rules={{ required: true }}
              />
              {errors?.EventDetails?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
            </section>

            <section>
              <label>Event Image (jpg/jpeg or png)</label>
              <form>
                <input
                  type='file'
                  onChange={hanleImgChange}
                  accept='image/jpeg, image/png'
                />
              </form>
              <Box className={classes.previewStyle}>
                <img
                  className={classes.imgStyle}
                  src={src}
                  alt={alt}
                  className='form-img__img-preview'
                />
              </Box>
            </section>

            <Typography className={classes.subtitleStyle}>
              Date and Time
            </Typography>

            <Box display='flex' width='100%' justifyContent='space-between'>
              <section className={classes.halfStyle}>
                <label>Event start date:</label>
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        console.log(format(e, 'dd/MM/yyyy', {awareOfUnicodeTokens: true}))
                        setStartDate(format(e, 'dd/MM/yyyy', {awareOfUnicodeTokens: true}))
                      }}
                      inputRef={field.ref}
                      className={classes.pickerStyle}
                    />
                  )}
                  name='StartDate'
                  control={control}
                  rules={{ required: true }}
                />
                {errors?.StartDate?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>

              <section className={classes.halfStyle}>
                <label>Event end date:</label>
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        console.log(format(e, 'dd/MM/yyyy', {awareOfUnicodeTokens: true}))
                        setEndDate(format(e, 'dd/MM/yyyy', {awareOfUnicodeTokens: true}))
                      }}
                      inputRef={field.ref}
                      className={classes.pickerStyle}
                    />
                  )}
                  name='EndDate'
                  control={control}
                  rules={{ required: true }}
                />
                {errors?.EndDate?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>
            </Box>

            <Box display='flex' width='100%' justifyContent='space-between'>
              <section className={classes.halfStyle}>
                <label>Event start time:</label>
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption='Time'
                      dateFormat='h:mm aa'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setStartTime(format(e, 'h:mm aa', {awareOfUnicodeTokens: true}))
                      }}
                      inputRef={field.ref}
                      className={classes.pickerStyle}
                      onChangeRaw={(event) => {
                        console.log(event.target.value);
                      }}
                    />
                  )}
                  name='StartTime'
                  control={control}
                  rules={{ required: true }}
                />
                {errors?.StartTime?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>

              <section className={classes.halfStyle}>
                <label>Event end time:</label>
                <Controller
                  render={({ field }) => (
                    <DatePicker
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption='Time'
                      dateFormat='h:mm aa'
                      selected={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setEndTime(format(e, 'h:mm aa', {awareOfUnicodeTokens: true}))
                      }}
                      inputRef={field.ref}
                      className={classes.pickerStyle}
                    />
                  )}
                  name='EndTime'
                  control={control}
                  rules={{ required: true }}
                />
                {errors?.EndTime?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>
            </Box>

            <Typography className={classes.subtitleStyle}>
              Location Information:
            </Typography>

            <section className={classes.checkBoxStyle}>
              <Controller
                name='IsOnlineEvent'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    color='primary'
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                      setOnlineEvent(e.target.checked);
                    }}
                    checked={field.value || false}
                  />
                )}
              />
              <label>This is an online event</label>
            </section>
            {onlineEvent ? null : (
              <>
                <section className={classes.formStyle}>
                  <label>Venue name:</label>
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
                    name='VenueName'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors?.VenueName?.type === 'required' && (
                    <Alert severity='error'>This field is required.</Alert>
                  )}
                </section>

                <section className={classes.formStyle}>
                  <label>Street address:</label>
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
                    name='StreetAddress'
                    control={control}
                    rules={{ required: true }}
                  />
                  {errors?.StreetAddress?.type === 'required' && (
                    <Alert severity='error'>This field is required.</Alert>
                  )}
                </section>

                <section className={classes.halfStyle}>
                  <label>Postcode and Suburb</label>
                  <PostalCodeAutoComplete control={control} />
                  {errors?.suburb?.type === 'required' && (
                    <Alert severity='error'>This field is required.</Alert>
                  )}
                </section>
              </>
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
        </Grid>
      </Grid>
    </>
  );
}

export default EventEditPage;
