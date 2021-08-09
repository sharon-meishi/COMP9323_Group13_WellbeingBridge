//OrganizationAvatar component: display orgtype picture and orgtype name and link to orgtype search
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
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
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
  },
  linkStyle: {
    fontFamily: `'Gill Sans', 'Roboto'`,
    fontWeight: '500',
    fontSize: '18px',
    textAlign: 'center',
    cursor: 'pointer',
  },
}));
function OrganizationAvatar({ alt, src, title }) {
  const classes = useStyles();
  const history = useHistory();

  const toOrgSearch = () => {
    const data = { orgType: title };
    const queryPath = new URLSearchParams(data).toString();
    const path = {
      pathname: 'organization/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };
  return (
    <Grid item xs={2} className={classes.item} >
      <Avatar alt={alt} src={src} className={classes.avatarStyle} onClick={toOrgSearch}/>
      <Link onClick={toOrgSearch} color='inherit' className={classes.linkStyle}>
        {title}
      </Link>
    </Grid>
  );
}

export default OrganizationAvatar;
