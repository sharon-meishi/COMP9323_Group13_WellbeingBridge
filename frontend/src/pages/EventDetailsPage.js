import React from 'react';
import NavBar from '../components/NavBar';
import { getEventDetail } from '../components/api';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
const useStyles = makeStyles({
  card: {
    margin:'3% 20%',
    minWidth: 275,
  },
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
  React.useEffect(()=>getEvent(),[]);
  return (
    <div>
      <NavBar />
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2">
          {detail.eventName}
          </Typography>
          <CardMedia
        className={classes.media}
        image={detail.thumbnail}
        title="event photo"
        />
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default EventDetailsPage;
