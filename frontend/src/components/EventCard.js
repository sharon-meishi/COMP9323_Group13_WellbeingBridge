import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { getEventSummary } from './api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 335,
    margin: '20px 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    
  },
  media: {
    height: 0,
    paddingTop: '85%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  title: {
    fontSize: '1.2rem',
    textDecoration: 'underline',
    fontWeight: 400,
  },
  location: {
    fontSize: '0.9rem',
    justifyContent: 'end',
    alignSelf: 'flex-end',
    fontWeight: 500,
    
  },
  date: {
    fontSize: '0.7rem',
    fontStyle:'italic'
  },
  detail: {
    paddingTop: '2%',
    height: '10%',
  },
  actions: {
    display: 'flex',
  },
  view: {
    paddingLeft: '35%',
  },
}));

function EventCard(props) {
  const classes = useStyles();
  const [info, setInfo] = useState(null);
  const preventDefault = (event) => event.preventDefault();

  useEffect(() => {
    console.log(props.eventId);
    const fetchData = async () => {
      const res = await getEventSummary(props.eventId);
      if (res[0] === 200) {
        setInfo(res[1]);
      }
    };
    fetchData();
  }, []);

  console.log(info);

  return info ? (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={info.thumbnail}
        title='Event Image'
      />

      <Box display='flex' flexDirection='column' height='100%' justifyContent='space-between'>
      <CardContent>
        <Grid container direction='column'>
          <Typography className={classes.title}>{info.name}</Typography>
          <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
            <Typography className={classes.date} color='textSecondary'>
              {info.date}
            </Typography>
            <Typography className={classes.location}>
              {info.location.suburb}
            </Typography>
          </Box>
        </Grid>

        <Grid className={classes.detail}>
          <Typography>{info.introduction}</Typography>
        </Grid>
      </CardContent>

      <CardActions className={classes.actions} disableSpacing>
        <IconButton aria-label='add to favorites'>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton>
        <Link
          href={`/event/${props.eventId}`}
          // onClick={preventDefault}
          className={classes.view}
          variant='body2'
          // to={`/event/${eventId}`}
        >
          Discover More
        </Link>
      </CardActions>
      </Box>
    </Card>
 
  ) : null;
}

export default EventCard;
