import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import cardimg from '../../Assets/logo-placeholder.png';
import {getOrgSummary} from '../api';
const useStyles = makeStyles({
  root: {
    maxWidth: 330,
    minWidth: 330,
    marginBottom:'15px',
  },
  media: {
    height: 140,
  },
  intro:{
    minHeight:'65px',
  },
  label:{
    marginLeft:'20px',
  },
  actionStyle: {
    justifyContent: 'flex-end'
  }
});

export default function OrgCard({Id}) {
  const history = useHistory();
  const classes = useStyles();
  const [cardInfo, setCardInfo] = React.useState({});
  const [cardLogo, setCardLogo] = React.useState(cardimg);
  const getInfo = async()=>{
    const res = await getOrgSummary(Id);
    if (res[0] === 200){
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
  };
  const toOrgType = ()=>{
    const data = { orgType: cardInfo.OrganizationType };
    const queryPath = new URLSearchParams(data).toString();
    const path = {
      pathname: '/organization/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };
  return (
    <Card className={classes.root}>
      {/* <CardActionArea> */}

        <CardMedia
          className={classes.media}
          image={cardLogo}
          title="Organization Logo"
        />
        <CardContent>
          <Box display='flex' >
          <Typography gutterBottom variant="h5" component="h2">
          {cardInfo.OrganizationName}
          </Typography>
          <Chip label={`#${cardInfo.OrganizationType}`} className={classes.label}clickable color='primary' onClick={toOrgType} />
          </Box>
          <Typography className={classes.intro}variant="body2" color="textSecondary" component="p">
            {cardInfo.Introduction}
          </Typography>
        </CardContent>
      {/* </CardActionArea> */}
      <CardActions className={classes.actionStyle}>
        <Button size="small" color="primary" onClick={handleLink}>
          Discover More
        </Button>
      </CardActions>
    </Card>
  );
}

// export default OrgCard
