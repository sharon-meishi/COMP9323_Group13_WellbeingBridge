import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import ShareModal from './ShareModal';
import LoginModal from './NavigationBar/LoginModal';
import RegisterModal from './NavigationBar/RegisterModal';
import { getEventSummary, likeEvent, unlikeEvent } from './api';

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: 280,
    maxWidth: 335,
    // margin: '20px 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
    [theme.breakpoints.down('sm')]: {
      minWidth: 280,
    },
    height: '100%',
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
    '&:hover': {
      cursor: 'pointer',
    },
  },
  location: {
    fontSize: '0.9rem',
    justifyContent: 'end',
    alignSelf: 'flex-end',
    fontWeight: 500,
  },
  date: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
  },
  detail: {
    paddingTop: '2%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  view: {
    fontSize: '10px',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

function EventCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const [info, setInfo] = useState(null);
  const [islike, setIslike] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const res = await getEventSummary(props.eventId);
      if (res[0] === 200) {
        console.log(res[1]);
        setInfo(res[1]);
        if (res[1].favourite) {
          setIslike(true);
        }
      }
    };
    fetchData();
  }, [props.eventId]);

  const checkDetail = () => {
    history.push(`/event/${props.eventId}`);
  };
  const handleShare = () => {
    setShare(true);
  };
  const handleLike = async () => {
    if (!token) {
      setOpenLogin(true);
    }
    if (islike) {
      const res = await unlikeEvent(props.eventId);
      if (res[0] === 200) {
        setIslike(false);
      } else {
        console.log('unlike error');
      }
    } else {
      const res = await likeEvent(props.eventId);
      if (res[0] === 200) {
        setIslike(true);
      } else {
        console.log('like error');
      }
    }
  };

  const toSearchPage = () => {
    const queryData = {eventCategory : info.category};
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`
    }
    history.push(path);
  }

  return info ? (
    <Card className={classes.root}>
      {openLogin ? (
        <LoginModal
          open={openLogin}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      {openRegister ? (
        <RegisterModal
          open={openRegister}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      <ShareModal open={share} setShare={setShare} eventId={props.eventId} />
      <CardMedia
        className={classes.media}
        image={info.thumbnail}
        title='Event Image'
      />

      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        justifyContent='space-between'
      >
        <CardContent className={classes.content}>
          <Box>
            <Grid container direction='column'>
              <Box display='flex' justifyContent='space-between' >
                <div onClick={checkDetail} className={classes.title}>
                  {info.name}
                </div>
                {/* <div color='textSecondary'>{`${info.bookedUser.length} has booked`}</div> */}
              </Box>

              <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
                <div className={classes.date} color='textSecondary'>
                  {info.startdate} to {info.enddate}
                </div>
                <div className={classes.location}>{info.location.postcode}</div>
              </Box>
            </Grid>

            <Grid className={classes.detail}>
              <div>{info.introduction}</div>
            </Grid>
          </Box>
          <Box alignSelf='flex-end'>
            <Chip label={`#${info.category}`} clickable color='primary' onClick={toSearchPage} />
          </Box>
        </CardContent>

        <CardActions className={classes.actions} disableSpacing>
          <Box>
            {sessionStorage.getItem('usergroup') === 'individual' ? (
              <IconButton onClick={handleLike} aria-label='add to favorites'>
                {islike ? (
                  <FavoriteIcon color='secondary' fontSize='default' />
                ) : (
                  <FavoriteIcon color='disabled' fontSize='default' />
                )}
              </IconButton>
            ) : null}
            <IconButton aria-label='share' onClick={handleShare}>
              <Tooltip title='Share' placement='right'>
                <ShareIcon />
              </Tooltip>
            </IconButton>
          </Box>
          <Button
            onClick={checkDetail}
            size='small'
            color='primary'
            className={classes.view}
          >
            Discover More
          </Button>
        </CardActions>
      </Box>
    </Card>
  ) : null;
}

export default EventCard;
