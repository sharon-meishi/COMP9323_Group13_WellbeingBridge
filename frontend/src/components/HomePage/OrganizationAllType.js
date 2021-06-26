import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Youth from '../../Assets/OrganizationType/youth.jpeg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#C5EDE9',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '16px',
      paddingTop: '16px'
  }
}));

function OrganizationAllType() {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  return (
    <Grid container justify='center' className={classes.root}>
      <Grid item xs={12} className={classes.row}>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      </Grid>
      <Grid item xs={12} className={classes.row}>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      <Grid item xs={2} className={classes.item}>
        <Avatar alt='Youth' src={Youth} />
        <Link href='#' onClick={preventDefault} color='inherit'>
          Youth
        </Link>
      </Grid>
      </Grid>

    </Grid>
  );
}

export default OrganizationAllType;
