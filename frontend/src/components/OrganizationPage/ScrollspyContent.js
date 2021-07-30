import React, { useEffect, useState, useContext } from 'react';
import Scrollspy from 'react-scrollspy';
import { AppContext } from '../../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import { Comment, Form, Header } from 'semantic-ui-react';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import logoPlaceholder from '../../Assets/logo-placeholder.png';
import comingSoon from '../../Assets/video-coming-soon.gif';
import EventCard from '../EventCard';
import YoutubeVideo from './YoutubeVideo';
import { getOrganizationDetails } from '../api';

const useStyles = makeStyles((theme) => ({
  scrollspy: {
    display: 'flex',
    flexDirection: 'column',
    fontSize:'20px',
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
    fontWeight: '400',
    marginBottom: '20px',
  },
  boldStyle: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
  },
  service: {
    fontFamily: 'Noto Sans',
    fontWeight: '400',
    marginBottom: '10px',
  },
  eventcard: {
    display: 'flex',
    justifyContent: 'center',
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
  eventBox: {
    marginBottom: '20px',
  },
  linkStyle: {
    marginLeft: '8px',
    cursor: 'pointer',
  },
}));

const labels = {
  1: 'Useless',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

function ScrollspyContent({ oId }) {
  const classes = useStyles();
  const context = useContext(AppContext);
  const BottomSyle = {
    borderBottom: '1px solid #DCDCDC',
    marginBottom: '30px',
  };
  const [data, setData] = useState(null);
  const [review, setReview] = useState('');
  const [newRating, setNewRating] = useState(3);
  const [ratingHover, setRatingHover] = useState(-1);

  const submitNewReview = async () => {
    console.log(review);
  };

  const matchYoutubeUrl = (url) => {
    const p =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const matches = url.match(p);
    if (matches) {
      return matches[1];
    }
    return false;
  };

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
          <Grid item xs={8} md={7} lg={6} xl={5} className={classes.content}>
            <section id='Name' style={BottomSyle}>
              <div className={classes.box}>
                <Box display='flex' flexDirection='column' flexWrap='wrap'>
                  <h2>{data.organizationName}</h2>
                  <Box display='flex' alignItems='center' flexWrap='wrap'>
                    <Rating value={3.5} name='read-only' readOnly precision={0.5}/>
                    <Box ml={1}>{3.5}</Box>
                    <Link className={classes.linkStyle} href='#Reviews'>
                      Add your review
                    </Link>
                  </Box>
                </Box>
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

            <section id='Services' style={BottomSyle}>
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

            <section id='Video' style={BottomSyle}>
              <h2>Video:</h2>
              {data.video ? (
                <YoutubeVideo vId={matchYoutubeUrl(data.video)} />
              ) : (
                <img
                  alt='video coming soon'
                  src={comingSoon}
                  className={classes.video}
                />
              )}
            </section>

            <section id='Contact' style={BottomSyle}>
              <h2>Other Information:</h2>
              <div className={classes.service}>
                <span className={classes.boldStyle}>Contract:</span>{' '}
                {data.contact}
              </div>

              {data.websiteLink ? (
                <div className={classes.service}>
                  <span className={classes.boldStyle}>Website Link:</span>{' '}
                  {data.websiteLink}
                </div>
              ) : null}
            </section>

            <section id='Reviews' style={BottomSyle}>
              <h2>Reviews:</h2>
              <Comment.Group size='large' style={{ maxWidth: '100%' }}>
                <Form onSubmit={submitNewReview}>
                  <Box display='flex' mb={1}>
                    <Rating
                      value={newRating}
                      onChange={(event, newValue) => {
                        setNewRating(newValue);
                      }}
                      onChangeActive={(event, newHover) => {
                        setRatingHover(newHover);
                      }}
                    />
                    {newRating !== null && <Box ml={2}>{labels[ratingHover !== -1 ? ratingHover : newRating]}</Box>}
                  </Box>
                  <Form.TextArea
                    placeholder='Please leave your review here'
                    name='review'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                  />
                  <Box display='flex' justifyContent='flex-end' mb={1}>
                    <Form.Button
                      size='tiny'
                      content='Add Review'
                      labelPosition='left'
                      icon='edit'
                      primary
                    />
                  </Box>
                </Form>
              </Comment.Group>
            </section>

            <Grid container id='Events' className={classes.eventBox}>
              <h2>Their Events: </h2>
              <Grid container item className={classes.eventcard} spacing={3}>
                {data.otherEvents.length === 0 ? (
                  <div className={classes.introduction}>
                    No event at the moment, please wait:)
                  </div>
                ) : (
                  data.otherEvents.map((item) => {
                    return (
                      <Grid item xs={11} md={6} lg={4}>
                        <EventCard eventId={item} />
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : null}
    </div>
  );
}

export default ScrollspyContent;
