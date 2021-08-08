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
import Tooltip from '@material-ui/core/Tooltip';
import DeleteModal from './DeleteModal';
import ShareModal from '../ShareModal';
import BookingDialog from './BookingDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 270,
    maxWidth: 270,
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
    display: 'flex',
  },
}));

function OrgEventCard({
  eventId,
  eventName,
  startdate,
  enddate,
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
  const [booking, setBooking] = React.useState(false);

  const editEvent = () => {
    history.push(`/event/edit/${eventId}`);
  };

  const checkDetail = () => {
    history.push(`/event/${eventId}`);
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
      <BookingDialog
        open={booking}
        onClose={() => setBooking(false)}
        info={bookedUser}
        eventName={eventName}
      />
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
          onClick={checkDetail}
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
                <Box
                  onClick={checkDetail}
                  style={{ fontSize: '15px', fontWeight:'bold', cursor: 'pointer' }}
                >
                  {eventName}
                </Box>
                <Box display='flex'>
                  <Button
                    variant='outlined'
                    disabled={bookedUser.length === 0 ? true : false}
                    color='primary'
                    className={classes.buttonStyle}
                    onClick={() => setBooking(true)}
                  >
                    {bookedUser.length} Bookings
                  </Button>
                </Box>
              </Box>
              <Box justifyContent='space-between' mt={1} mb={1}>
                <Typography className={classes.date} color='textSecondary'>
                  {startdate} to {enddate}
                </Typography>
                <Typography className={classes.location} style={{textAlign:'end'}}>{postcode || 'ONLINE EVENT'}</Typography>
              </Box>
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
            </Box>
          </CardActions>
        </Box>
      </Card>
    </>
  );
}

export default OrgEventCard;
