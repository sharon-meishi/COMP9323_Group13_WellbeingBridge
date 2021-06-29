import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
// import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SamplePic from '../Assets/eventPic.jpeg';

const useStyles = makeStyles((theme) => ({
    root: {
      width: 325,
      margin:'20px 0 20px 0',
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
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
function EventCard(props) {
    const classes = useStyles();
    // const [expanded, setExpanded] = React.useState(false);
    const {eventId, thumbnail, name, date, location, favourite} = props.info;
    // const handleExpandClick = () => {
    //   setExpanded(!expanded);
    // };
    // console.log(id);
    console.log(props);
    // console.log(props.info);

    return (
      <Card className={classes.root}>
        {/* <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        /> */}
        <CardMedia
          className={classes.media}
          image={SamplePic}
          title="Paella dish"
        />
        <CardContent>
          <Typography variant="h6" color="textSecondary" component="p">
          {name}
          </Typography>          
          <Typography variant="body1" color="textSecondary" component="p">
          {location.suburb}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>

          {/* <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
          </IconButton> */}
        </CardActions>
      </Card>
    );
}

export default EventCard


