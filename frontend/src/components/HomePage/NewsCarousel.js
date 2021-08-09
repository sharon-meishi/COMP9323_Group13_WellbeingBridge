//NewsCarousel component: display news and links to other health services
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import bg1 from '../../Assets/new1.jpeg';
import bg2 from '../../Assets/OrganizationType/mental_health.jpeg';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  item: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  carouselStyle: {
    backgroundSize: 'cover',
    height: '350px',
    marginLeft: '100px',
    marginRight: '100px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  carouselStyle2: {
    backgroundSize: 'cover',
    height: '350px',
    marginLeft: '100px',
    marginRight: '100px',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
  },
  boxStyle: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '16px',
    backgroundColor: '#4A6B79',
    opacity: '0.9',
    color: 'white',
    padding: '16px',
    width: '50%',
    alignItems: 'flex-start',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderLeft: '7px solid #C5EDE9',
  },
  liStyle: {
    fontSize:'16px',
    '&::marker': {
      color: '#C5EDE9',
    },
    textAlign: 'left',
    '& :hover': {
      color: 'white',
      
    }
  },
}));

function NewsCarousel() {
  const classes = useStyles();

  return (
    <Grid container justify='center' className={classes.root}>
      <Grid item xs={10} className={classes.item}>
        <Carousel
          navButtonsAlwaysVisible={true}
          interval='100000'
          className={classes.item}
        >
          <Card
            className={classes.carouselStyle}
            style={{
              backgroundImage: `url(${bg1})`,
            }}
          >
            <Box className={classes.boxStyle}>
              <h1>Get COVID-19 Health Information</h1>
              <ul>
                <li className={classes.liStyle}>
                  <Link
                    href='https://covid-vaccine.healthdirect.gov.au/eligibility'
                    color='inherit'
                    underline='always'
                  >
                    Book your COVID-19 vaccination
                  </Link>
                </li>
                <li className={classes.liStyle}>
                  <Link
                    href='https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert/coronavirus-covid-19-current-situation-and-case-numbers'
                    color='inherit'
                    underline='always'
                  >
                    COVID-19 current situation and case numbers
                  </Link>
                </li>
                <li className={classes.liStyle}>
                  <Link
                    href='https://www.health.gov.au/news/health-alerts/novel-coronavirus-2019-ncov-health-alert/how-to-protect-yourself-and-others-from-coronavirus-covid-19'
                    color='inherit'
                    underline='always'
                  >
                    How to protect yourself?
                  </Link>
                </li>
              </ul>
            </Box>
          </Card>
          <Card
            className={classes.carouselStyle2}
            style={{
              backgroundImage: `url(${bg2})`,
            }}
          >
            <Box className={classes.boxStyle}>
              <h1>Know Yourself Better</h1>
              <ul>
                <li className={classes.liStyle}>
                  <Link
                    href='https://screening.mhanational.org/screening-tools/'
                    color='inherit'
                    underline='always'
                  >
                    Take a mental health test
                  </Link>
                </li>
                <li className={classes.liStyle}>
                  <Link
                    href='https://www.beyondblue.org.au/the-facts/anxiety-and-depression-checklist-k10'
                    color='inherit'
                    underline='always'
                  >
                    Anxiety and depression checklist
                  </Link>
                </li>
                <li className={classes.liStyle}>
                  <Link
                    href='https://www.healthline.com/health/stress/how-to-relax#takeaway'
                    color='inherit'
                    underline='always'
                  >
                    How to relax: tips for chiling out
                  </Link>
                </li>
              </ul>
            </Box>
          </Card>
        </Carousel>
      </Grid>
    </Grid>
  );
}

export default NewsCarousel;
