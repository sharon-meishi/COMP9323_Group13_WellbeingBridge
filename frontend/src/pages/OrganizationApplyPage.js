import React, { useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import { AppContext } from '../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles( (theme) => ({
  backgroundStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '30px',
    width: '100%',
  },
  GridStyle: {
    width: '100%',
  },
  titleStyle: {
    textAlign: 'center',
    fontFamily: 'Noto Sans',
    fontWeight: '500',
    textDecoration: 'underline',
    color: '#26A69A',
  },
  formStyle: {
    paddingTop: '30px',
  },
  formControl: {
    width: '50%',
    margin: '20px 0'
  },
}));

function OrganizationApplyPage() {
  const classes = useStyles();
  const context = useContext(AppContext);
  const [organizationType, setOrganizationType] = useState('')
  return (
    <Box>
      <NavBar />
      <Grid container className={classes.backgroundStyle}>
        <Grid item xs={11} sm={9} md={7} lg={6} className={classes.GridStyle}>
          <Typography variant='h5' className={classes.titleStyle}>
            Register your organization
          </Typography>
          <form className={classes.formStyle}>
            <TextField
              required
              id='standard-required'
              label='Organization Name (Required)'
              variant='outlined'
              fullWidth
            />
            <FormControl variant='outlined' className={classes.formControl}>
              <InputLabel id='Organization-Type-label'>
              Organization Type
              </InputLabel>
              <Select
                labelId='Organization-Type-label'
                id='Organization-Type-select'
                value={organizationType}
                onChange={(e)=> {setOrganizationType(e.target.value)}}
                label='Organization Type(Required)'
              >
                <MenuItem value={1}>Youth</MenuItem>
                <MenuItem value={2}>Disability and carers</MenuItem>
                <MenuItem value={3}>Senior</MenuItem>
                <MenuItem value={4}>Family</MenuItem>
                <MenuItem value={5}>Education</MenuItem>
                <MenuItem value={6}>Employment</MenuItem>
                <MenuItem value={7}>Body health</MenuItem>
                <MenuItem value={8}>Mental health</MenuItem>
                <MenuItem value={9}>Money</MenuItem>
                <MenuItem value={10}>Legal services</MenuItem>
              </Select>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrganizationApplyPage;
