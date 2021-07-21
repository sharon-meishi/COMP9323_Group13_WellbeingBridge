import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { getEventSummary, getOrganizationProfile} from '../api';
import { useHistory } from 'react-router-dom';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 335,
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

function OrgEventCard(props) {
  const classes = useStyles();
  const [info, setInfo] = useState(null);
  const eventId = props.eventId;
//   const preventDefault = (event) => event.preventDefault();
//   const [islike, setIslike] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const history = useHistory();
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const usergroup = sessionStorage.getItem('usergroup');
  const oid = sessionStorage.getItem('id');
  console.log(`usergroup = ${usergroup}`);
  const fetchData = async () => {
    const res = await getEventSummary(eventId);
    if (res[0] === 200) {
      setInfo(res[1]);
      console.log(res[1]);
    }
    if (usergroup === 'organization'){
      const orgDetail = await getOrganizationProfile(oid);
      console.log(orgDetail[1]);
      console.log(eventId);
      if (orgDetail[1].publishedEvent.indexOf(eventId)>0){
        setEditable(true);
        console.log('set Editable True');
      }
    }
  };
  useEffect(() => {fetchData();}, []);

  const checkDetail = ()=>{
    history.push(`/event/${eventId}`);
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
        {/* {usergroup === 'orgnazition'? <IconButton onClick={handleLike} aria-label='add to favorites'>
          {islike?<FavoriteIcon color='secondary' fontSize='medium'/>
                  :<FavoriteIcon color="disabled" fontSize='medium'/>
          } */}
        {/* </IconButton>
        :null} */}
        {editable?<DeleteOutlinedIcon />:null}
        {editable?<Link
          href={`/event/edit/${eventId}`}
          variant='body2'
        >
          Edit
        </Link>:null}
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
      </Box>
    </Card>
 
  ) : null;
}

export default OrgEventCard;
