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
import { getEventSummary, likeEvent, unlikeEvent } from './api';
import { useHistory } from 'react-router-dom';
import LoginModal from './NavigationBar/LoginModal';
import RegisterModal from './NavigationBar/RegisterModal';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 335,
    maxWidth: 335,
    margin: '20px 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    padding:'1%',
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
    '&:hover':{
      cursor:'pointer',
    }
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
  const [islike, setIslike] = React.useState(false);
  const history = useHistory();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const token = sessionStorage.getItem('token');
  // const usergroup = sessionStorage.getItem('usergroup');
  // console.log(`usergroup = ${usergroup}`);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getEventSummary(props.eventId);
      if (res[0] === 200) {
        setInfo(res[1]);
        console.log(res[1]);
        console.log(res[1].favourite);
        if(res[1].favourite){
          console.log('initial liked')
          setIslike(true);
        }
      }
    };
    fetchData();
  }, []);

  const checkDetail = ()=>{
    history.push(`/event/${props.eventId}`);
  }
  const handleLike = async ()=>{
    if (!token){
      setOpenLogin(true);
    }
    if (islike){
      console.log('now it is liked');
      const res = await unlikeEvent(props.eventId);
      if (res[0] === 200){
        setIslike(false);
        console.log('unlike success');
      }else{
        console.log('unlike error');
      }
    }else{
      console.log('now it is not liked');
      const res = await likeEvent(props.eventId);
      if (res[0] === 200){
        setIslike(true);
        console.log('like success');
      }else{
        console.log('like error');
      }
    }
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
      <CardMedia
        className={classes.media}
        image={info.thumbnail}
        title='Event Image'
      />

      <Box display='flex' flexDirection='column' height='100%' justifyContent='space-between'>
      <CardContent>
        <Grid container direction='column'>
          <Typography onClick={checkDetail}className={classes.title}>{info.name}</Typography>
          <Box display='flex' justifyContent='space-between' mt={1} mb={1}>
            <Typography className={classes.date} color='textSecondary'>
              {info.date}
            </Typography>
            <Typography className={classes.location}>
              {info.location.postcode}
            </Typography>
          </Box>
        </Grid>

        <Grid className={classes.detail}>
          <Typography>{info.introduction}</Typography>
        </Grid>
      </CardContent>

      <CardActions className={classes.actions} disableSpacing>
        <IconButton onClick={handleLike} aria-label='add to favorites'>
          {islike?<FavoriteIcon color='secondary' fontSize='medium'/>
                  :<FavoriteIcon color="disabled" fontSize='medium'/>
          }
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
