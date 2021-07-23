import React, { useEffect, useState } from 'react';
import Scrollspy from 'react-scrollspy';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import logoPlaceholder from '../../Assets/logo-placeholder.png';
import comingSoon from '../../Assets/video-coming-soon.gif';
import EventCard from '../EventCard';
import { getOrganizationDetails } from '../api';
import YoutubeVideo from './YoutubeVideo';

const useStyles = makeStyles((theme) => ({
  scrollspy: {
    fontFamily: 'Noto sans',
    display: 'flex',
    flexDirection: 'column',
    margin: '150px 0 0 5%',
    position: 'fixed',
    top: 0,
    left: 0,
    fontWeight: '400',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      margin: '0',
    },
  },
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
  },
  menu: {
    listStyle: 'none',
  },
  item: {
    margin: '10px',
    fontWeight: 'bold',
    padding: '10px 0',
  },
  isCurrent: {
    fontWeight: 'bold',
    color: '#26A69A',
  },
  content: {
    paddingTop: '40px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '0',
    },
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  logo: {
    width: '100%',
    height: '100px',
    [theme.breakpoints.down('md')]: {
      height: '80px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '50px',
    },
  },
  introduction: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  service: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  eventcard: {
    display: 'flex',
  },
  video: {
    marginBottom: '15px',
  },
  videoResponsive: {
    overflow: 'hidden',
    paddingBottom: '56.25%',
    position: 'relative',
    height: '0',
  },
  frame: {
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
}));

function ScrollspyContent({ oId }) {
  const classes = useStyles();
  const BottomSyle = {
    borderBottom: '3px solid rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
  };
  const [data, setData] = useState(null);

  useEffect(() => {
    const getOrganization = async () => {
      const res = await getOrganizationDetails(oId);
      if (res[0] === 200) {
        setData(res[1]);
      } else {
        console.log('There is something wrong in getOrganization.');
      }
    };
    getOrganization();
  }, [oId]);

  console.log(data);

  return (
    <div>
      {data ? (
        <Grid container className={classes.root}>
          <Scrollspy
            className={classes.scrollspy}
            items={['Details', 'Services', 'Video', 'Contact', 'Events']}
            currentClassName={classes.isCurrent}
          >
            <Link className={classes.item} href='#Details' color='inherit'>
              Details
            </Link>
            <Link className={classes.item} href='#Services' color='inherit'>
              Services
            </Link>
            <Link className={classes.item} href='#Video' color='inherit'>
              Video
            </Link>
            <Link className={classes.item} href='#Contact' color='inherit'>
              Contact
            </Link>
            <Link className={classes.item} href='#Events' color='inherit'>
              Events
            </Link>
          </Scrollspy>
          <Grid
            item
            xs={8}
            md={7}
            lg={6}
            xl={5}
            className={classes.content}
          >
            <section id='Name' style={BottomSyle}>
              <div className={classes.box}>
                <h2>{data.organizationName}</h2>
                <div>
                  <img
                    alt='logo'
                    src={data.logo || logoPlaceholder}
                    className={classes.logo}
                  />
                </div>
              </div>
              <div className={classes.introduction}>{data.introduction}</div>
            </section>
            <section id='Details' style={BottomSyle}>
              <h2>Details</h2>
              <div className={classes.introduction}>
                {data.details || 'Nothing at the moment, please wait:)'}
              </div>
            </section>
            <section id='Service' style={BottomSyle}>
              <h2>Services: </h2>
              {data.serviceList.length === 0 ? (
                <div className={classes.introduction}>
                  Nothing at the moment, please wait:)
                </div>
              ) : (
                data.serviceList.map((item) => {
                  return <div className={classes.service}>• {item}</div>;
                })
              )}
            </section>
            <section id='Contact' style={BottomSyle}>
              <h2>Video:</h2>
              {data.video ? (
                <YoutubeVideo vId={data.video.split('https://youtu.be/')[1]} />
              ) : (
                <img
                  alt='video coming soon'
                  src={comingSoon}
                  className={classes.video}
                />
              )}
            </section>
            <section id='Events' style={BottomSyle}>
              <h2>Other Information:</h2>
              <div className={classes.service}>Contract: {data.contact}</div>
              <div className={classes.service}>
                {data.websiteLink ? `Website Link:${data.websiteLink}` : null}
              </div>
            </section>
            <section id='Events' style={BottomSyle}>
              <h2>Their Events: </h2>
              <div className={classes.eventcard}>
                {data.otherEvents.length === 0 ? (
                  <div className={classes.introduction}>
                    No event at the moment, please wait:)
                  </div>
                ) : (
                  data.otherEvents.map((item) => {
                    return (
                      <EventCard
                        style={{ marginLeft: '20px' }}
                        eventId={item}
                      />
                    );
                  })
                )}
              </div>
            </section>
          </Grid>
        </Grid>
      ) : null}
    </div>
  );
}

export default ScrollspyContent;
