import React from 'react';
import NavBar from '../components/NavBar';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import { getEventDetails, likeEvent, unlikeEvent, bookEvent, unbookEvent, getOrganizationProfile } from '../components/api';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import CardActions from '@material-ui/core/CardActions';
import EventCard from '../components/EventCard';
import Link from '@material-ui/core/Link';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ShareIcon from '@material-ui/icons/Share';

const useStyles = makeStyles({
  card: {
    margin:'3% 10%',
    minWidth: 275,
    display:'flex',
    flexDirection:'column',
  },
  top:{
    display:'flex',
    flexDirection:'row',
  },
  left: {
    margin:'3%',
    width:'60%',
    height:'50%',

  },
  title:{
    display:'flex',
    justifyContent:'space-between',
    // backgroundColor :'green',
  },
  actions:{
    display:'flex',
  },
  like:{
    marginLeft:'5%',
    alignItems:'start',
  },
  isbook:{
    '&:hover': {
      backgroundColor: '#166b3d',
      // boxShadow: 'none',
    },
    color:'white',
    backgroundColor:'green',
    height:'35px',
    margin:'1.5% 10%',
  },
  notbook:{
    color:'green',
    borderColor:'green',
    // backgroundColor:'green',

    height:'35px',
    margin:'1.5% 10%',
  },
  notfavourite:{
    backgroundColor:'white',
    borderWidth:'1px',
  },
  photo:{
    overflow:'hidden',
    width:'300px',
    height:'500px',
  },
  org:{
    float:'right',
    paddingRight:'5%',
  },
  info:{
    display:'flex',
    width:'100%',
    paddingBottom:'5%',
    flexDirection:'column',
    paddingTop:'5%',
    borderBottomStyle:'solid',
    borderWidth:'1px',
  },
  intro:{
    paddingTop:'5%',
    paddingBottom:'5%',
    borderBottomStyle:'solid',
    borderWidth:'1px',
  },
  more:{
    paddingTop:'5%',
    paddingBottom:'5%',
    borderBottomStyle:'solid',
    borderWidth:'1px',
  },
  comment:{
    padding:'5% 2% 5% ',
    borderBottomStyle:'solid',
    borderWidth:'1px',
  }
});
function EventDetailsPage({match}) {
  const classes = useStyles();
  const eventId = match.params.eventId;
  console.log()
  const [detail, setDetail] = React.useState({});
  const [islike, setIslike] = React.useState(false);
  const [isbook, setIsbook] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [recomList, setRecomList] = React.useState([]);
  const [editable, setEditable] = React.useState(false);
  const usergroup = sessionStorage.getItem('usergroup');
  const oid = sessionStorage.getItem('id');
  console.log(`usergroup = ${usergroup}`);
  const token = sessionStorage.getItem('token');
  console.log(token);
  const getEvent = async ()=>{
    const res = await getEventDetails(eventId);
    if (res[0] === 200){
      setDetail(res[1]);
      setRecomList(res[1].recommendation);
      console.log(res[1]);
      if(res[1].favourite){
          console.log('initial liked')
          setIslike(true);
      }
      if(res[1].booked){
        console.log('initial booked')
        setIsbook(true);
      }
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
  }
  console.log(detail.OrganizationName);
  React.useEffect(()=>getEvent(),[]);
  
  const handleLike = async ()=>{
    if (!token){
      setOpenLogin(true);
    }
    if (islike){
      console.log('now it is liked');
      const res = await unlikeEvent(eventId);
      if (res[0] === 200){
        setIslike(false);
        console.log('unlike success');
      }else{
        console.log('unlike error');
      }
    }else{
      console.log('now it is not liked');
      const res = await likeEvent(eventId);
      if (res[0] === 200){
        setIslike(true);
        console.log('like success');
      }else{
        console.log('like error');
      }
    }
  }
  const handleBook = async ()=>{
    if (!token){
      setOpenLogin(true);
    }
    if (isbook){
      const res = await unbookEvent(eventId);
      if (res[0] === 200){
        setIsbook(false);
        console.log('set unbook success');
      }else{
        console.log('set unbook error');
      }
    }else{
      const res = await bookEvent(eventId);
      if (res[0] === 200){
        setIsbook(true);
        console.log('set book success');
      }else{
        console.log('set book error');
      }
    }
  }
  return (
    <div>
      <NavBar />
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
      <Card className={classes.card}>
        {/* <CardContent> */}
        <Grid className={classes.top}>
          <Grid className={classes.left}>
            <Grid className={classes.title}>
              <Typography variant="h4" component="h2">
                {detail.eventName}
              </Typography>
              {usergroup === 'organization'?
              <CardActions>   
              {editable?<DeleteOutlinedIcon />:null}
              {editable?<Link
                  href={`/event/edit/${eventId}`}
                  // onClick={preventDefault}
                //   className={classes.view}
                  variant='body2'
                  // to={`/event/${eventId}`}
                >
                  Edit
                </Link>:null}
            </CardActions>
            :<CardActions className={classes.actions} disableSpacing>
            <IconButton className={classes.like} onClick={handleLike} aria-label='add to favorites'>
              {islike?<FavoriteIcon color='secondary' fontSize='medium'/>
                     :<FavoriteIcon color="disabled" fontSize='medium'/>
              }
            </IconButton>
            <div className={classes.book} onClick={handleBook} aria-label='add to favorites'>
              {isbook?<Button variant="contained" className={classes.isbook}>UNBOOK</Button>
                     :<Button variant="outlined" className={classes.notbook}>BOOK</Button>
              }
            </div>
            
        </CardActions>   }
          <IconButton aria-label='share'>
            <ShareIcon />
          </IconButton>
            </Grid>
            <Typography variant="body1" className={classes.org}>
                By {detail.OrganizationName}
              </Typography>
            <Grid className={classes.info}>
              <Typography variant="body1" className={classes.org}>
                When: {detail.date}
              </Typography>
              <Typography variant="body1" className={classes.org}>
                What time: {detail.time}
              </Typography>
              <Typography variant="body1" className={classes.org}>
                Where: {detail.location ? detail.location.address : ''}
              </Typography>
            </Grid>
            <Grid className={classes.intro}>
            <Typography variant="h6" >
                Introduction:
              </Typography>
                <Typography variant="body1" className={classes.description}>
                {detail.introduction}
              </Typography>
            </Grid>
            <Grid className={classes.more}>
                <Typography variant="h6" >
                    More about this event:
                </Typography>
                <Typography variant="body1" className={classes.description}>
                {detail.details}
                </Typography>
            </Grid>
            <Grid className={classes.comment}>
            <Typography variant="h6" >
                Comments:
              </Typography>
            </Grid>
            <Grid className={classes.recommendation}>
            <Typography variant="h6" >
                Recommendation:
              </Typography>
              {recomList.map((eventId) => (
              <EventCard
                key={eventId}
                eventId={eventId}
              />
            ))}
            </Grid>
        </Grid>

        <CardMedia className={classes.photo}>
            <img src={detail.thumbnail}/>
          </CardMedia>
        </Grid>     
      </Card>
    </div>
  )
}

export default EventDetailsPage;
