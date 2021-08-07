import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { storage } from '../firebase';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import logoPlaceholder from '../../Assets/logo-placeholder.png';
import YoutubeVideo from './YoutubeVideo';
import LoadingBackdrop from '../LoadingBackdrop';
import SuccessDialog from '../EventEditPage/SuccessDialog';
import VideoPlacerholder from '../../Assets/video-placeholder.jpeg';
import { updateOrgPage } from '../api';

const useStyles = makeStyles(() => ({
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
    fontSize: '30px',
    fontWeight: '500',
    color: '#26A69A',
  },
  subStyle: {
    fontSize: '12px',
    fontWeight: '700',
  },
  subtitleStyle: {
    fontSize: '18px',
    marginTop: '30px',
    fontWeight: '700',
  },
  formStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '15px',
  },
  selectStyle: {
    marginTop: '8px',
    marginBottom: '4px',
    height: '40px',
  },
  buttonStyle: {
    fontSize: '16px',
    marginTop: '20px',
    marginBottom: '10px',
    width: '40%',
    alignSelf: 'center',
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
  video: {
    marginBottom: '15px',
  },
  videoResponsive: {
    overflow: 'hidden',
    paddingBottom: '56.25%',
    position: 'relative',
    height: '0',
  },
  frame: {
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
}));

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}

function OrganizationForm({ oId, preloadValues, preloadImg }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: preloadValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'serviceList',
  });

  const watchFieldArray = watch('serviceList');

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const matchYoutubeUrl = (url) => {
    const p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const matches = url.match(p);
    if (matches) {
      return matches[1];
    }
    return false;
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const [vId, setVId] = useState(
    preloadValues.video ? matchYoutubeUrl(preloadValues.video) : ''
  );

  const [{ alt, src }, setImg] = useState({
    alt: 'Upload an Img',
    src: preloadImg,
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

  const resetForm = () => {
    reset();
    setImg({
      alt: 'Upload an image',
      src: preloadImg,
    });
    setURL('');
  }



  const onSubmit = async (data) => {
    setLoading(true);
    setData(data);
    if (data.picture){
      handleUpload();
    } else {
      setURL(preloadImg)
    }
  };

  useEffect(() => {
    const buildBody = () => {
      const sl = data.serviceList ? data.serviceList.map((x) => x.service) : ''
      const uploadBody = {
        organizationName: data.OrgName,
        organizationType: data.OrganizationType,
        introduction: data.OrganizationIntroduction,
        contact: data.Contact,
        details: data.OrganizationDetail || '',
        serviceList: sl ? sl.join('@') : '',
        logo: url,  
        video: data.video || '',
        websiteLink: data.websiteLink || '',
      };
      return uploadBody;
    };

    const sendData = async(uploadBody) =>{
      const Data = await updateOrgPage(oId, uploadBody);
      if (Data[0] === 200){
        console.log('update success');
        setLoading(false);
        setOpen(true);
      } else{
        setLoading(false);
        setErrorMsg('There is something wrong when uploading, please try again')
      }
    }
    if(url){
      const uploadBody = buildBody();
      sendData(uploadBody)
    }

  }, [url]);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    reset();
    setImg({
      alt: 'Upload an image',
      src: preloadImg,
    });
    setURL('');
    setLoading(false);
  }, [preloadImg, reset]);

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
          Edit your organization page
        </Typography>
        <hr />
        <Typography className={classes.subStyle}>
          You must complete all the fields in Basic Information
        </Typography>
        <SuccessDialog
        oId={oId}
        open={open}
        setOpen={setOpen}
        message='Thank you! Your organization page has been updated successfully'
        />
        <form onSubmit={handleSubmit(onSubmit)} className={classes.formStyle}>
          <>
            <Typography className={classes.subtitleStyle}>
              Basic Information (Required):
            </Typography>
            <section className={classes.formStyle}>
              <label>Organization Name (Less than 100 characters):</label>
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
                name='OrgName'
                control={control}
                rules={{ required: true, maxLength: 100 }}
              />
              {errors?.OrgName?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              {errors?.OrgName?.type === 'maxLength' && (
                <Alert severity='error'>
                  This field should be less than 100 characters.
                </Alert>
              )}
            </section>
            <section className={classes.formStyle}>
              <label>Organization Type:</label>
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
                      <MenuItem value='Body Health'>Body Health</MenuItem>
                      <MenuItem value='Community'>Community</MenuItem>
                      <MenuItem value='Disability and Carers'>
                        Disability and Carers
                      </MenuItem>
                      <MenuItem value='Education'>Education</MenuItem>
                      <MenuItem value='Employment'>Employment</MenuItem>
                      <MenuItem value='Family'>Family</MenuItem>
                      <MenuItem value='Financial and Legal'>
                        Financial and Legal
                      </MenuItem>
                      <MenuItem value='Mental Health'>Mental Health</MenuItem>
                      <MenuItem value='Senior'>Senior</MenuItem>
                      <MenuItem value='Youth'>Youth</MenuItem>
                    </Select>
                  );
                }}
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
                Organization Introduction (Less than 200 characters):
              </label>
              <Controller
                render={({ field }) => (
                  <TextField
                    id='OrganizationIntroduction'
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
                name='OrganizationIntroduction'
                control={control}
                rules={{ required: true, maxLength: 200 }}
              />
              {errors?.OrganizationIntroduction?.type === 'required' && (
                <Alert severity='error'>This field is required.</Alert>
              )}
              {errors?.OrganizationIntroduction?.type === 'maxLength' && (
                <Alert severity='error'>
                  This field should be less than 200 characters.
                </Alert>
              )}
            </section>

            <section className={classes.formStyle}>
              <label>Contact (Email or Phone number):</label>
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
              Detail Information (Optional):
            </Typography>
            <section className={classes.formStyle}>
              <label>Organization Details :</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    id='OrganizationDetail'
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
                name='OrganizationDetail'
                control={control}
              />
            </section>
            <section className={classes.formStyle}>
              <label>Services List (No comma allow):</label>
              <section className={classes.formStyle}>
                {controlledFields.map((item, index) => {
                  return (
                    <Box mb={1}>
                      <Box
                        key={item.id}
                        display='flex'
                        width='100%'
                        justifyContent='space-between'
                      >
                        <Controller
                          render={({ field }) => (
                            <TextField
                              value={field.value || ''}
                              onChange={field.onChange}
                              inputRef={field.ref}
                              variant='outlined'
                              size='small'
                              margin='dense'
                              fullWidth
                            />
                          )}
                          rules={{ required: true, pattern: /^[^@]*$/ }}
                          name={`serviceList.${index}.service`}
                          control={control}
                          defaultValue={item.service} // make sure to set up defaultValue
                        />
                        <IconButton type='button' onClick={() => remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      {errors.serviceList?.[index]?.service.type ===
                        'required' && (
                        <Alert severity='error'>
                          This field is required, if you don't need it please
                          delete it.
                        </Alert>
                      )}
                      {errors.serviceList?.[index]?.service.type ===
                        'pattern' && (
                        <Alert severity='error'>'@' is not allowed</Alert>
                      )}
                    </Box>
                  );
                })}
              </section>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  append({ service: '' });
                }}
              >
                Add
              </Button>
            </section>
            <section className={classes.formStyle}>
              <label>Organization Logo(jpg/jpeg or png):</label>
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
              <Box className={classes.previewStyle}>
                <img
                  className={classes.imgStyle}
                  src={src || logoPlaceholder}
                  alt={alt}
                />
              </Box>
            </section>
            <section className={classes.formStyle}>
              <label>Youtube Video Link:</label>
              <Controller
                render={({ field }) => (
                  <TextField
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e);
                      const id = matchYoutubeUrl(e.target.value);
                      if (id) {
                        setVId(id);
                      }
                    }}
                    inputRef={field.ref}
                    variant='outlined'
                    size='small'
                    margin='dense'
                  />
                )}
                defaultValue=''
                name='video'
                control={control}
                rules={{
                  validate: {
                    validURL: (value) => {
                      if (value){
                        const id = matchYoutubeUrl(value);
                        if (id){
                          setVId(id);
                          return true
                        } else{
                          return false
                        }
                      } else {
                        return true
                      }
                    },
                  },
                }}
              />
              {errors?.video && (
                <Alert severity='error'>
                  Please fill in valid Youtube video URL
                </Alert>
              )}
              <Typography>
                Video preview (If you don't see your video below please re-check
                your video url)
              </Typography>
              <Box mt={1}>
                {vId ? (
                  <YoutubeVideo vId={vId} />
                ) : (
                  <img
                    alt='video placeholder'
                    src={VideoPlacerholder}
                    className={classes.imgStyle}
                  />
                )}
              </Box>
            </section>
            <section className={classes.formStyle}>
              <label>Website Link:</label>
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
                defaultValue=''
                name='websiteLink'
                control={control}
              />
            </section>
          </>
          <Box display='flex' justifyContent='space-around' flexWrap='wrap'>
            <Button
              onClick={resetForm}
              variant='outlined'
              color='primary'
              className={classes.buttonStyle}
            >
              Reset
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={classes.buttonStyle}
            >
              Submit
            </Button>
            <LoadingBackdrop open={loading} />
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}

export default OrganizationForm;
