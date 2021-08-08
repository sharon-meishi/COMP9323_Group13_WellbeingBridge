import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import youth from '../../Assets/OrganizationType/youth.jpeg';
import senior from '../../Assets/OrganizationType/senior.jpeg';
import family from '../../Assets/OrganizationType/family.jpeg';
import mental_health from '../../Assets/OrganizationType/mental_health.jpeg';
import body_health from '../../Assets/OrganizationType/body_health.jpeg';
import disability_and_carers from '../../Assets/OrganizationType/disability_and_carers.jpeg';
import education from '../../Assets/OrganizationType/education.jpeg';
import employment from '../../Assets/OrganizationType/employment.jpeg';
import money from '../../Assets/OrganizationType/money.jpeg';
import community from '../../Assets/OrganizationType/community.jpeg';
import OrganizationAvatar from './OrganizationAvatar';
import HomePageButton from './HomePageButton';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: '#C5EDE9',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between ',
    alignItems: 'center',
  },
  item: {
    width: '100%',
  },
  title: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleStyle: {
    textDecoration: 'underline',
    fontFamily: `'Noto Sans', 'Roboto'`,
    fontWeight: '500',
  },
}));

function OrganizationAllType() {
  const classes = useStyles();
  const history = useHistory();

  const toOrgSearch = () => {
    history.push('/organization/search');
  };

  return (
    <Box className={classes.box}>
      <Grid container className={classes.root}>
        <Grid item sm={10} md={9} xl={8} className={classes.item}>
          <Box className={classes.title} mt={2} mb={2}>
            <Typography variant='h4' className={classes.titleStyle}>
              Organization Types
            </Typography>
            <HomePageButton text='Find Organization' onClick={toOrgSearch} />
          </Box>
          <Box
            display='flex'
            width='100%'
            justifyContent='space-between'
            mb={1}
          >
            <OrganizationAvatar
              alt='youth'
              src={youth}
              title='Youth'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='senior'
              src={senior}
              title='Seniors'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='family'
              src={family}
              title='Family'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='mental_health'
              src={mental_health}
              title='Mental Health'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='body_health'
              src={body_health}
              title='Body Health'
            ></OrganizationAvatar>
          </Box>
          <Box
            display='flex'
            width='100%'
            justifyContent='space-between'
            mb={2}
          >
            <OrganizationAvatar
              alt='community'
              src={community}
              title='Community'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='disability_and_carers'
              src={disability_and_carers}
              title='Disability and Carers'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='education'
              src={education}
              title='Education'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='employment'
              src={employment}
              title='Employment'
            ></OrganizationAvatar>
            <OrganizationAvatar
              alt='Financial and Legal'
              src={money}
              title='Financial and Legal'
            ></OrganizationAvatar>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrganizationAllType;
