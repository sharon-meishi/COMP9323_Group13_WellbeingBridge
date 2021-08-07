import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import placeholder from '../../Assets/placeholder.png';
import PostalCodeAutoComplete from './PostalCodeAutoComplete';
import LoadingBackdrop from '../LoadingBackdrop';
import SuccessDialog from './SuccessDialog';
import { storage } from '../firebase';
import { createEventRequest, updateEventDetails } from '../api';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete';
import 'react-datepicker/dist/react-datepicker.css';

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}

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
    objectFit: 'contain',
  },
  imgBoxLabel: {
    marginTop: '8px',
  },
  addressStyle: {
    color: 'black',
    height: '40px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function EventForm({
  eventId,
  preloadedValues,
  preloadedImg,
  preloadedAddress,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [eId, setEId] = useState(eventId);

  // useForm setting and set default values
  const {
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: preloadedValues,
  });

  const [loading, setLoading] = useState(false);

  // event location
  const [eventFormat, setEventFormat] = useState(
    eventId ? preloadedValues.EventFormat : ''
  );
  const [lat, setLat] = useState(eventId ? preloadedValues.lat : null);
  const [lng, setlng] = useState(eventId ? preloadedValues.lng : null);

  // event date and time
  const [data, setData] = useState('');
  const [startDate, setStartDate] = useState(
    eventId
      ? format(preloadedValues.StartDate, 'dd/MM/yyyy', {
          awareOfUnicodeTokens: true,
        })
      : ''
  );
  const [endDate, setEndDate] = useState(
    eventId
      ? format(preloadedValues.EndDate, 'dd/MM/yyyy', {
          awareOfUnicodeTokens: true,
        })
      : ''
  );
  const [startTime, setStartTime] = useState(
    eventId
      ? format(preloadedValues.StartTime, 'h:mm aa', {
          awareOfUnicodeTokens: true,
        })
      : ''
  );
  const [endTime, setEndTime] = useState(
    eventId
      ? format(preloadedValues.EndTime, 'h:mm aa', {
          awareOfUnicodeTokens: true,
        })
      : ''
  );

  // Event Image
  const [{ alt, src }, setImg] = useState({
    alt: 'Upload an Img',
    src: preloadedImg,
  });
  const [file, setFile] = useState(null);
  const [url, setURL] = useState('');

  const handleImgChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setImg({
        alt: e.target.files[0].name,
        src: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUpload = async () => {
    const date = new Date();
    const fileName = `${sessionStorage.getItem(
      'id'
    )}-${date.toLocaleString()}-${file.name}`;
    const ref = storage.ref(`/images/${fileName}`);
    const uploadTask = ref.put(file);
    uploadTask.on('state_changed', console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        setFile(null);
        setURL(url);
      });
    });
  };

  const setLatLng = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setLat(lat.toFixed(6));
        setlng(lng.toFixed(6));
        console.log('Successfully got latitude and longitude', { lat, lng });
      });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setData(data);
    if (data.picture) {
      handleUpload();
    } else {
      setURL(preloadedImg);
    }
    if (data.address) {
      setLatLng(data.address.label);
    }
  };

  useEffect(() => {
    const buildBody = () => {
      let location = {};
      if (eventFormat === 'Online Event') {
        location = {
          postcode: '',
          address: '',
          lat: '',
          lng: '',
        };
      } else {
        location = {
          postcode: data.Postcode,
          address: data.address ? data.address.label : preloadedAddress,
          lat: lat,
          lng: lng,
        };
      }
      const uploadBody = {
        eventName: data.EventName,
        thumbnail: url,
        format: data.EventFormat,
        category: data.EventCategory,
        location: location,
        startdate: startDate,
        enddate: endDate,
        time: `${startTime} to ${endTime}`,
        introduction: data.EventIntroduction,
        details: data.EventDetails,
      };
      return uploadBody;
    };
    const sendData = async (uploadBody) => {
      let Data;
      if (eventId) {
        Data = await updateEventDetails(eventId, uploadBody);
      } else {
        Data = await createEventRequest(uploadBody);
      }
      if (Data[0] === 200) {
        if(eventId){
          setEId(eventId);
        }else {
          setEId(Data[1].eventid)
        }
        console.log('create/update success');
        setLoading(false);
        setOpen(true);
      } else {
        setErrorMsg(`Something wrong ${Data[1]}`);
      }
    };

    if (url && lat && lng) {
      const uploadBody = buildBody();
      sendData(uploadBody);
    } else if (eventFormat === 'Online Event' && url){
      const uploadBody = buildBody();
      sendData(uploadBody);
    }
  }, [url, lat, lng]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
    setImg({
      alt: 'Upload an image',
      src: preloadedImg,
    });
    setURL('');
    setLoading(false);
  }, [preloadedImg, reset]);

  return (
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
        {errorMsg ? <FetchAlert severity='error'>{errorMsg}</FetchAlert> : null}
        <Typography variant='h5' className={classes.titleStyle}>
          {eventId ? 'Edit your event' : 'Create a new event'}
        </Typography>
        <hr />
        <Typography className={classes.centerStyle}>
          All fields are required.
        </Typography>
        <SuccessDialog
          open={open}
          setOpen={setOpen}
          eventId={eId}
          message={
            eventId
              ? 'Thank you! Your event information has been updated successfully!'
              : 'Thank you! Your event has been created successfully!'
          }
        />
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formStyle}>
          <Typography className={classes.subtitleStyle}>
            Event Information:
          </Typography>
          <>
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
            <Box display='flex' justifyContent='space-between'>
              <section className={classes.halfStyle}>
                <label>Event Format:</label>
                <Controller
                  render={({ field }) => {
                    return (
                      <Select
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e);
                          setEventFormat(e.target.value);
                        }}
                        ref={field.ref}
                        variant='outlined'
                        className={classes.selectStyle}
                      >
                        <MenuItem value='Online Event'>Online Event</MenuItem>
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
              <section className={classes.halfStyle}>
                <label>Event Category:</label>
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
                        <MenuItem value='Sports and fitness'>
                        Sports and fitness
                        </MenuItem>
                        <MenuItem value='Multicultural'>Multicultural</MenuItem>
                        <MenuItem value='Mental Health'>
                        Mental Health
                        </MenuItem>
                        <MenuItem value='Family'>Family</MenuItem>
                        <MenuItem value='Community organised'>Community organised</MenuItem>
                        <MenuItem value='Seniors'>Seniors</MenuItem>
                        <MenuItem value='Young People'>Young People</MenuItem>
                      </Select>
                    );
                  }}
                  name='EventCategory'
                  control={control}
                  rules={{ required: true }}
                />
                {errors?.EventCategory?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>
            </Box>

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

            <section className={classes.imgBoxLabel}>
              <label>Event Image (jpg/jpeg or png)</label>
              {eventId ? (
                <Controller
                  render={({ field }) => (
                    <input
                      type='file'
                      value={field.value || ''}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImgChange(e);
                      }}
                      inputRef={field.ref}
                      accept='image/jpeg, image/png'
                    />
                  )}
                  name='picture'
                  control={control}
                />
              ) : (
                <Controller
                  render={({ field }) => (
                    <input
                      type='file'
                      value={field.value || ''}
                      onChange={(e) => {
                        field.onChange(e);
                        handleImgChange(e);
                      }}
                      inputRef={field.ref}
                      accept='image/jpeg, image/png'
                    />
                  )}
                  name='picture'
                  control={control}
                  rules={{ required: true }}
                />
              )}
              {errors?.picture?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              <Box className={classes.previewStyle}>
                <img
                  className={classes.imgStyle}
                  src={src || placeholder}
                  alt={alt}
                />
              </Box>
            </section>
          </>

          <Typography className={classes.subtitleStyle}>
            Date and Time:
          </Typography>
          <>
            <Box display='flex' width='100%' flexDirection='column'>
              <Box display='flex' width='100%' justifyContent='space-between'>
                <section className={classes.halfStyle}>
                  <label>Event start date:</label>
                  <Controller
                    render={({ field }) => (
                      <DatePicker
                        isClearable
                        dateFormat='dd/MM/yyyy'
                        selected={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e) {
                            setStartDate(
                              format(e, 'dd/MM/yyyy', {
                                awareOfUnicodeTokens: true,
                              })
                            );
                          }
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
                        isClearable
                        dateFormat='dd/MM/yyyy'
                        selected={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e) {
                            setEndDate(
                              format(e, 'dd/MM/yyyy', {
                                awareOfUnicodeTokens: true,
                              })
                            );
                          }
                        }}
                        inputRef={field.ref}
                        className={classes.pickerStyle}
                      />
                    )}
                    name='EndDate'
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) => {
                        const { StartDate } = getValues();
                        const diff = StartDate - value;
                        return (
                          diff <= 0 ||
                          'End date should not be earlier than start date'
                        );
                      },
                    }}
                  />
                  {errors?.EndDate?.type === 'required' && (
                    <Alert severity='error'>This field is required.</Alert>
                  )}
                </section>
              </Box>
              {errors?.EndDate?.type === 'validate' && (
                <Alert severity='error'>{errors.EndDate.message}</Alert>
              )}
            </Box>

            <Box display='flex' width='100%' flexDirection='column'>
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
                          setStartTime(
                            format(e, 'h:mm aa', {
                              awareOfUnicodeTokens: true,
                            })
                          );
                        }}
                        inputRef={field.ref}
                        className={classes.pickerStyle}
                        onChangeRaw={(event) => {
                          // console.log(event.target.value);
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
                          setEndTime(
                            format(e, 'h:mm aa', {
                              awareOfUnicodeTokens: true,
                            })
                          );
                        }}
                        inputRef={field.ref}
                        className={classes.pickerStyle}
                      />
                    )}
                    name='EndTime'
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) => {
                        const { StartTime } = getValues();
                        const diff = StartTime - value;
                        console.log(StartTime, value)
                        return (
                          diff <= 0 ||
                          'End time should not be earlier than start time'
                        );
                      },
                    }}
                  />
                  {errors?.EndTime?.type === 'required' && (
                    <Alert severity='error'>This field is required.</Alert>
                  )}
                </section>
              </Box>
              {errors?.EndTime?.type === 'validate' && (
                <Alert severity='error'>{errors.EndTime.message}</Alert>
              )}
            </Box>
          </>

          {eventFormat === 'Online Event' ? null : (
            <>
              <Typography className={classes.subtitleStyle}>
                Location Information:
              </Typography>

              <section className={classes.formStyle}>
                <label>Event address:</label>
                {eventId ? (
                  <Controller
                    render={({ field }) => (
                      <GooglePlacesAutocomplete
                        className={classes.addressStyle}
                        selectProps={{
                          value: field.value,
                          onChange: field.onChange,
                          placeholder: 'Search for address...',
                          defaultValue: {
                            label: preloadedAddress,
                            value: preloadedAddress,
                          },
                        }}
                        minLengthAutocomplete={3}
                      />
                    )}
                    name='address'
                    control={control}
                  />
                ) : (
                  <Controller
                    render={({ field }) => (
                      <GooglePlacesAutocomplete
                        className={classes.addressStyle}
                        selectProps={{
                          value: field.value,
                          onChange: field.onChange,
                          placeholder: 'Search for address...',
                        }}
                        minLengthAutocomplete={3}
                      />
                    )}
                    name='address'
                    control={control}
                    rules={{ required: true }}
                  />
                )}

                {errors?.address?.type === 'required' && (
                  <Alert severity='error'>This field is required.</Alert>
                )}
              </section>
              <section className={classes.halfStyle}>
                <label>Postcode and Suburb</label>
                <PostalCodeAutoComplete control={control} />
                {errors?.Postcode?.type === 'required' && (
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
          <LoadingBackdrop open={loading} />
        </form>
      </Grid>
    </Grid>
  );
}

export default EventForm;
