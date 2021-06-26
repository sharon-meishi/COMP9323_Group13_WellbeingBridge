import React from 'react';
import Carousel from 'react-material-ui-carousel';
import NewsItem from './NewsItem';
import bg1 from '../../Assets/new1.jpeg';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  item: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  carouselStyle: {
      height: '100%'
  }
}));

function NewsCarousel() {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs ={10}  className={classes.item}>
        <Carousel navButtonsAlwaysVisible={true} interval='100000' className={classes.item}>
          <NewsItem title='New1' backgroundImg={bg1} />
          <NewsItem title='New2' backgroundImg={bg1}/>
          <NewsItem title='New3' backgroundImg={bg1}/>
        </Carousel>
      </Grid>
    </Grid>
  );
}

export default NewsCarousel;
