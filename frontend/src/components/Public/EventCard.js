// EventCard component: display event summary
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../utils/store';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import RoomIcon from '@material-ui/icons/Room';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { red } from '@material-ui/core/colors';
import ShareModal from './ShareModal';
import LoginModal from '../NavigationBar/LoginModal';
import RegisterModal from '../NavigationBar/RegisterModal';
import { getEventSummary, likeEvent, unlikeEvent, getOrgSummary } from '../Helper/api';

const useStyles = makeStyles((theme) => ({
  root: {
    width:300,
    display: 'flex',
    flexDirection: 'column',
    padding: '1%',
    [theme.breakpoints.down('sm')]: {
      minWidth: 280,
    },
    height: 560,
  },
  media: {
    height: 0,
    paddingTop: '85%', 
    '&:hover': {
      cursor: 'pointer',
    },
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
    textAlign: 'end',
    fontWeight: 500,
  },
  date: {
    fontSize: '0.7rem',
    fontStyle: 'italic',
    color: '#757575',
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
  avatar: {
    backgroundColor: red[500],
  },
  cardHeaderRoot: {
    '& .MuiAvatar-root': {
      width: '50px',
      height: '50px',
      cursor: 'pointer',
    },
    '& .MuiCardHeader-title': {
      fontSize: '18px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    '& .MuiCardHeader-action': {
      alignSelf: 'center',
    },
    '& .MuiCardHeader-subheader': {
      fontWeight: 'none',
    },
  },
  eventMarker: {
    color: '#3f51b5',
  },
  selectedStyle: {
    border: '3px solid #26A69A',
    padding: '8px',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
}));

function EventCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AppContext);
  const [info, setInfo] = useState(null);
  const [orgInfo, setOrgInfo] = useState(null);
  const [islike, setIslike] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [share, setShare] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      const res = await getEventSummary(props.eventId);
      if (res[0] === 200) {
        setInfo(res[1]);
        if (res[1].favourite) {
          setIslike(true);
        }
      }
    };
    if (props.eventInfo) {
      setInfo(props.eventInfo);
      if (props.eventInfo.favourite) {
        setIslike(true);
      }
    } else {
      fetchData();
    }
  }, [props.eventId, props.eventInfo]);

  useEffect(() => {
    if (info) {
      const fetchOrgData = async () => {
        const res = await getOrgSummary(info.orgid);
        if (res[0] === 200) {
          setOrgInfo(res[1]);
        }
      };
      fetchOrgData();
    }
  }, [info,islike]);

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

  const searchCategory = () => {
    const queryData = { category: info.category };
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };

  const searchFormat = () => {
    const queryData = { format: info.format };
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };

  const toOrgPage = () => {
    history.push(`/organization/${info.orgid}`);
  };

  return info ? (
    <Box
      className={
        context.selected === props.order ? classes.selectedStyle : null
      }
    >
      <Card className={classes.root} id={props.order || props.eventId}>
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
        {orgInfo ? (
          <CardHeader
            className={classes.cardHeaderRoot}
            title={
              <Box onClick={toOrgPage}>
                {orgInfo.OrganizationName}
              </Box>
            }
            subheader={`${info.bookedUser.length} people have booked`}
            avatar={
              <Avatar
                aria-label='organization Logo'
                src={orgInfo.Logo}
                onClick={toOrgPage}
              >
                {orgInfo.OrganizationName.charAt(0)}
              </Avatar>
            }
            action={
              props.order ? (
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  className={classes.eventMarker}
                >
                  <Box fontSize='17px' fontWeight='bold'>
                    {props.order}
                  </Box>
                  <RoomIcon fontSize='large' color='primary' />
                </Box>
              ) : null
            }
          />
        ) : null}
        <CardMedia
          className={classes.media}
          image={info.thumbnail}
          title='Event Image'
          onClick={checkDetail}
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
                <Box display='flex' justifyContent='space-between'>
                  <div onClick={checkDetail} className={classes.title}>
                    {info.name}
                  </div>
                </Box>

                <Box justifyContent='space-between' mt={1} mb={1}>
                  <div className={classes.date} color='textSecondary'>
                    {info.startdate} to {info.enddate}
                  </div>
                  <div className={classes.location}>
                    {info.format === 'Online Event'
                      ? 'ONLINE EVENT'
                      : info.location.postcode}
                  </div>
                </Box>
              </Grid>
            </Box>
            <Box alignSelf='flex-end'>
              <Chip
                label={`#${info.format}`}
                clickable
                color='primary'
                onClick={searchFormat}
                style={{ marginRight: '5px' }}
              />
              <Chip
                label={`#${info.category}`}
                clickable
                color='primary'
                onClick={searchCategory}
              />
            </Box>
          </CardContent>

          <CardActions className={classes.actions} disableSpacing>
            <Box>
              {sessionStorage.getItem('usergroup') !== 'organization' ? (
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
    </Box>
  ) : null;
}

export default EventCard;
