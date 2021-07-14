import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SamplePic from '../Assets/eventPic.jpeg';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 325,
    margin: '20px 0 20px 0',
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
    // paddingRight:"1%",
    width: '65%',
    textDecoration: 'underline',
    // color:"textSecondary",
  },
  location: {
    fontSize: '0.9rem',
    justifyContent: 'end',
    paddingTop: '9%',
    width: '35%',
    // color:"textSecondary",
  },
  // expandOpen: {
  //   transform: 'rotate(180deg)',
  // },
  date: {
    paddingTop: '2%',
    fontSize: '0.7rem',
  },
  detail: {
    paddingTop: '2%',
    height: '10%',
  },
  // avatar: {
  //   backgroundColor: red[500],
  // },
  actions: {
    display: 'flex',
  },
  view: {
    paddingLeft: '35%',
  },
}));
function EventCard(props) {
  const classes = useStyles();
  console.log(props.info);
  // const [expanded, setExpanded] = React.useState(false);
  const { eventId,introduction, thumbnail, name, date, location, favourite } = props.info;
  const preventDefault = (event) => event.preventDefault();
  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };
  // console.log(id);
  console.log(props);
  // console.log(props.info);

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={SamplePic}
        title='Paella dish'
      />
      <CardContent>
        <Grid container direction='row'>
          <Typography className={classes.title}>{name}</Typography>
          <Typography className={classes.location}>
            {/* {location.suburb} */}
          </Typography>
        </Grid>
        <Typography className={classes.date} color='textSecondary'>
          {date}
        </Typography>
        <Grid className={classes.detail}>
          <Typography >
            {introduction}
          </Typography>
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
          href={`/event/${eventId}`}
          // onClick={preventDefault}
          className={classes.view}
          variant='body2'
          // to={`/event/${eventId}`}
        >
          Discover More
        </Link>
      </CardActions>
    </Card>
  );
}

export default EventCard;
