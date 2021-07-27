import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteModal from './DeleteModal';
import ShareModal from '../ShareModal';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import BookingDialog from './BookingDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    margin: '1%',
  },
  media: {
    height: 0,
    paddingTop: '85%', // 16:9
  },
  title: {
    fontSize: '1.2rem',
    textDecoration: 'underline',
    fontWeight: 400,
    '&:hover': {
      cursor: 'pointer',
    },
    wordBreak: 'break-all',
  },
  location: {
    fontSize: '0.9rem',
    justifyContent: 'end',
    alignSelf: 'flex-end',
    fontWeight: 500,
  },
  delete: {
    cursor: 'pointer',
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
  tip: {
    bottom: '10px',
    '&:hover': {
      backgroundColor: 'green',
      top: '10px',
    },
  },
  date: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
  },
  detail: {
    paddingTop: '2%',
    height: '10%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  view: {
    fontSize: '8px',
  },
  buttonStyle: {
    display:'flex'
  }
}));

function OrgEventCard({
  eventId,
  eventName,
  eventDate,
  postcode,
  introduction,
  thumbnail,
  bookedUser,
  eventList,
  setEventList,
  
}) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [booking, setBooking] = React.useState(false);

  const editEvent = () => {
    history.push(`/event/edit/${eventId}`);
  };

  const checkDetail = () => {
    history.push(`/event/${eventId}`);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDelete = () => {
    setOpen(true);
  };
  const handleShare = () => {
    setShare(true);
    console.log('handleShare');
  };

  return (
    <>
    <BookingDialog open={booking} onClose={() => setBooking(false)} info={bookedUser} eventName={eventName}/>
    <Card className={classes.root}>
      <DeleteModal
        open={open}
        setOpen={setOpen}
        eventId={eventId}
        eventName={eventName}
        eventList={eventList}
        setEventList={setEventList}
      />
      <ShareModal open={share} setShare={setShare} eventId={eventId} />
      <CardMedia
        className={classes.media}
        image={thumbnail}
        title='Event Image'
      />
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='space-between'
      >
        <CardContent>
          <Grid container direction='column'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography onClick={checkDetail}>{eventName}</Typography>
              <Box display='flex'>
                <Button variant='outlined' disabled={bookedUser.length === 0? true : false} color='primary' className={classes.buttonStyle} onClick={() => setBooking(true)}>{bookedUser.length} Bookings</Button>
              </Box>
            </Box>
            <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
              <Typography className={classes.date} color='textSecondary'>
                {eventDate}
              </Typography>
              <Typography className={classes.location}>{postcode}</Typography>
            </Box>
          </Grid>
          <Grid className={classes.detail}>
            <Typography>{introduction}</Typography>
          </Grid>
        </CardContent>
        <CardActions className={classes.actions} disableSpacing>
          <Box display='flex'>
            <IconButton onClick={handleShare} aria-label='share'>
              <Tooltip title='Share' placement='top'>
                <ShareIcon />
              </Tooltip>
            </IconButton>

            <IconButton onClick={editEvent}>
              <Tooltip title='Edit' placement='top'>
                <EditIcon />
              </Tooltip>
            </IconButton>

            <IconButton onClick={handleDelete}>
              <Tooltip title='Delete' placement='top'>
                <DeleteOutlinedIcon />
              </Tooltip>
            </IconButton>
          </Box>
          <Box display='flex'>
            <Button
              onClick={checkDetail}
              size='small'
              color='primary'
              className={classes.view}
            >
              Discover More
            </Button>
            {/* <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
            >
              <ExpandMoreIcon />
            </IconButton> */}
          </Box>
        </CardActions>
        {/* {expanded ? (
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is
            absorbed, 15 to 18 minutes. Reduce heat to medium-low, add reserved
            shrimp and mussels, tucking them down into the rice, and cook again
            without stirring, until mussels have opened and rice is just tender,
            5 to 7 minutes more. (Discard any mussels that don’t open.)
          </Typography>
        ) : null} */}
      </Box>
    </Card>
    </>
  );
}

export default OrgEventCard;
