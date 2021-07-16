import React from 'react';
import NavBar from '../components/NavBar';
import { getEventDetail } from '../components/api';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';


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
//   title:{
//     display:'flex',
//     justifyContent:'space-between',
//     backgroundColor:'green',
//   },
  actions:{
    display:'flex',
  },
  like:{
    marginLeft:'5%',
  },
  bookbutton:{
    color:'green',
    borderColor:'green',
    height:'35px',

  },
  photo:{
    overflow:'hidden',
    width:'300px',
    height:'500px',
  },
  title:{
    display:'flex',
    flexDirection:'row',
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
  const [detail, setDetail] = React.useState({});
  const getEvent = async ()=>{
    const res = await getEventDetail([eventId]);
    if (res[0] === 200){
      console.log(res[1]);
      setDetail(res[1]);
    }
  }
  console.log(detail.OrganizationName);
  React.useEffect(()=>getEvent(),[]);
  return (
    <div>
      <NavBar />
      <Card className={classes.card}>
        {/* <CardContent> */}
        <Grid className={classes.top}>
          <Grid className={classes.left}>
            <Grid className={classes.title}>
              <Typography variant="h4" component="h2">
                {detail.eventName}
              </Typography>
              <IconButton className={classes.like} aria-label='add to favorites'>
                <FavoriteIcon />
              </IconButton>
              <Button variant="outlined" className={classes.bookbutton}>BOOK</Button>
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
                Where: {detail.location.venue}<br/>{detail.location.street}<br/>{detail.location.suburb}
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
        </Grid>

        <CardMedia className={classes.photo}>
            <img src={detail.thumbnail}/>
          </CardMedia>
        </Grid>
        <Grid className={classes.bottom}>

            <Grid className={classes.comment}>
            <Typography variant="h6" >
                Comments:
              </Typography>
            </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default EventDetailsPage;
