import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
  },
  avatarStyle: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    marginBottom: theme.spacing(1)
  },
  linkStyle: {
    fontFamily: `'Gill Sans', 'Roboto'`,
    fontWeight: '500',
    fontSize: '18px',
    textAlign: 'center'
  }
}));
function OrganizationAvatar({ alt, src, title }) {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  return (
    <Grid item xs={2} className={classes.item}>
      <Avatar alt={alt} src={src} className={classes.avatarStyle} />
      <Link href='#' onClick={preventDefault} color='inherit' className={classes.linkStyle}>
        {title}
      </Link>
    </Grid>
  );
}

export default OrganizationAvatar;
