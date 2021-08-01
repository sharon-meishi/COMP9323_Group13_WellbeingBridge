import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import cardimg from '../../Assets/logo-placeholder.png';
import {getOrgSummary} from '../api';
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth:345,
    marginBottom:'15px',
  },
  media: {
    height: 140,
  },
  intro:{
    minHeight:'65px',
  }
});

export default function OrgCard({Id}) {
  const history = useHistory();
  const classes = useStyles();
  console.log(`Id in OrgCard ${Id}`);
  const [cardInfo, setCardInfo] = React.useState({});
  const [cardLogo, setCardLogo] = React.useState(cardimg);
  const getInfo = async()=>{
    const res = await getOrgSummary(Id);
    if (res[0] === 200){
      console.log(res[1]);
      setCardInfo(res[1]);
      if (res[1].Logo){
        setCardLogo(res[1].Logo);
      }
    }
  }
  React.useEffect(()=>{
    getInfo();
  },[])

  const handleLink = ()=>{
    history.push(`/organization/${Id}`)
  }
  return (
    <Card className={classes.root}>
      <CardActionArea>

        <CardMedia
          className={classes.media}
          image={cardLogo}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {cardInfo.OrganizationName}
          </Typography>
          <Typography className={classes.intro}variant="body2" color="textSecondary" component="p">
            {cardInfo.Introduction}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={handleLink}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

// export default OrgCard
