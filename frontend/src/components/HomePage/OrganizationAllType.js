import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import OrganizationAvatar from './OrganizationAvatar'
import youth from '../../Assets/OrganizationType/youth.jpeg';
import senior from '../../Assets/OrganizationType/senior.jpeg';
import family from '../../Assets/OrganizationType/family.jpeg';
import mental_health from '../../Assets/OrganizationType/mental_health.jpeg';
import body_health from '../../Assets/OrganizationType/body_health.jpeg';
import disability_and_carers from '../../Assets/OrganizationType/disability_and_carers.jpeg'
import education from '../../Assets/OrganizationType/education.jpeg';
import employment from '../../Assets/OrganizationType/employment.jpeg';
import money from '../../Assets/OrganizationType/money.jpeg';
import community from '../../Assets/OrganizationType/community.jpeg';
import HomePageButton from '../HomePageButton'

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: '#C5EDE9',
  },
  root: {
    flexGrow: 1,
    width: '100%',
    margin: 'auto',
    justifyContent: 'center'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 16px',
  },
  title: {
    width: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
  },
  titleStyle: {
    textDecoration: 'underline',
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '500',
    fontSize: '1.8rem'
  },
}));

function OrganizationAllType() {
  const classes = useStyles();
  
  return (
    <Box className={classes.box}>
      <Grid container className={classes.root}>
        <Box className={classes.title}>
          <Typography className={classes.titleStyle}>
            What type of organization you are looking for?
          </Typography>
          <HomePageButton text='Find an Organization'/>
        </Box>
        <Grid item xs={12} className={classes.row}>
          <OrganizationAvatar alt='youth' src={youth} title='Youth'></OrganizationAvatar>
          <OrganizationAvatar alt='senior' src={senior} title='Senior'></OrganizationAvatar>
          <OrganizationAvatar alt='family' src={family} title='Family'></OrganizationAvatar>
          <OrganizationAvatar alt='mental_health' src={mental_health} title='Mental Health'></OrganizationAvatar>
          <OrganizationAvatar alt='body_health' src={body_health} title='Body Health'></OrganizationAvatar>
          
        </Grid>
        <Grid item xs={12} className={classes.row}>
        <OrganizationAvatar alt='community' src={community} title='Community'></OrganizationAvatar>
        <OrganizationAvatar alt='disability_and_carers' src={disability_and_carers} title='Disability and Carers'></OrganizationAvatar>
          <OrganizationAvatar alt='education' src={education} title='Education'></OrganizationAvatar>
          <OrganizationAvatar alt='employment' src={employment} title='Employment'></OrganizationAvatar>
          <OrganizationAvatar alt='Financial and Legal' src={money} title='Financial and Legal'></OrganizationAvatar>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrganizationAllType;
