import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import cardimg from '../../Assets/headspace.jpeg';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    minWidth:345,
  },
  media: {
    height: 140,
  },
});

export default function OrgCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={cardimg}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            HeadSpace
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            The Center is open to assist young people with health advice and support 
            and information, around a range of matters including: caring for others, stress, 
            relationships, employment and depression
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

// export default OrgCard
