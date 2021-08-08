import React, { useEffect, useState } from 'react';
import Scrollspy from 'react-scrollspy';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Comment, Form } from 'semantic-ui-react';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Rating from '@material-ui/lab/Rating';
import logoPlaceholder from '../../Assets/logo-placeholder.png';
import comingSoon from '../../Assets/video-coming-soon.gif';
import EventCard from '../EventCard';
import YoutubeVideo from './YoutubeVideo';
import SingleReview from './SingleReview';
import { getOrganizationDetails, postReview } from '../api';

const useStyles = makeStyles((theme) => ({
  scrollspy: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '20px',
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
    width: '100%',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
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
  eventItem: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const labels = {
  1: 'Worst',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

function ScrollspyContent({ oId }) {
  const classes = useStyles();
  const history = useHistory();
  const BottomSyle = {
    borderBottom: '1px solid #DCDCDC',
    marginBottom: '30px',
  };
  const [data, setData] = useState(null);
  const [review, setReview] = useState('');
  const [newRating, setNewRating] = useState(3);
  const [ratingHover, setRatingHover] = useState(-1);
  const [update, setUpdate] = useState(false);

  const submitNewReview = async () => {
    const Data = await postReview(oId, newRating, review);
    if (Data[0] === 200) {
      setNewRating(3);
      setReview('');
      setUpdate(true);
    }
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

  const toOrgType = () => {
    const urldata = { orgType: data.organizationType };
    const queryPath = new URLSearchParams(urldata).toString();
    const path = {
      pathname: '/organization/search',
      search: `?${queryPath}`,
    };
    history.push(path);
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
    setUpdate(false);
  }, [oId, update]);

  return (
    <div>
      {data ? (
        <Grid container className={classes.root}>
          <Scrollspy
            className={classes.scrollspy}
            items={[
              'Name',
              'Details',
              'Services',
              'Video',
              'Contact',
              'Reviews',
              'Events',
            ]}
            currentClassName={classes.isCurrent}
          >
            <Link className={classes.item} href='#Name' color='inherit'>
              Name
            </Link>
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
            <Link className={classes.item} href='#Reviews' color='inherit'>
              Reviews
            </Link>
            <Link className={classes.item} href='#Events' color='inherit'>
              Events
            </Link>
          </Scrollspy>
          <Grid item xs={9} md={8} lg={7} xl={6} className={classes.content}>
            <section id='Name' style={BottomSyle}>
              <div className={classes.box}>
                <Box display='flex' flexDirection='column' flexWrap='wrap'>
                  <Box display='flex' alignItems='baseline'>
                    <h2>{data.organizationName}</h2>
                    <Box ml={1}>
                      {' '}
                      <Chip
                        label={`#${data.organizationType}`}
                        className={classes.label}
                        clickable
                        color='primary'
                        onClick={toOrgType}
                      />
                    </Box>
                  </Box>

                  <Box display='flex' alignItems='center' flexWrap='wrap'>
                    <Rating value={data.rating} readOnly precision={0.5} />
                    <Box ml={1}>{data.rating || ''}</Box>
                    <Link className={classes.linkStyle} href='#Reviews'>
                      {data.rating === 0
                        ? 'Be the first one to review'
                        : 'Add your review'}
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
              <div></div>
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
                {data.contact.includes('@') ? (
                  <Link
                    style={{ cursor: 'pointer' }}
                    href={`mailto:${data.contact}`}
                  >
                    {data.contact}
                  </Link>
                ) : (
                  data.contact
                )}
              </div>

              {data.websiteLink ? (
                <div className={classes.service}>
                  <span className={classes.boldStyle}>Website Link:</span>{' '}
                  <Link
                    href={data.websiteLink}
                    style={{ cursor: 'pointer' }}
                    underline='hover'
                  >
                    {data.websiteLink}
                  </Link>
                </div>
              ) : null}
            </section>

            <section id='Reviews' style={BottomSyle}>
              <h2>Reviews:</h2>
              <Comment.Group
                size='large'
                style={{ maxWidth: '100%', marginBottom: '15px' }}
              >
                {sessionStorage.getItem('usergroup') === 'individual' ? (
                  <Form onSubmit={submitNewReview}>
                    <Box display='flex' mb={1}>
                      <Rating
                        value={newRating}
                        onChange={(event, newValue) => {
                          if (!newValue) {
                            setNewRating(1);
                          } else {
                            setNewRating(newValue);
                          }
                        }}
                        onChangeActive={(event, newHover) => {
                          setRatingHover(newHover);
                        }}
                      />
                      {newRating !== null && (
                        <Box ml={2}>
                          {labels[ratingHover !== -1 ? ratingHover : newRating]}
                        </Box>
                      )}
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
                ) : (
                  <Box fontSize='16px'>
                    Please Login as an individual user to post review
                  </Box>
                )}
                {data.reviews
                  ? data.reviews.map((eachReview, idx) => (
                      <SingleReview
                        key={idx}
                        content={eachReview}
                        oId={oId}
                        setUpdate={setUpdate}
                      />
                    ))
                  : null}
              </Comment.Group>
            </section>

            <Grid container id='Events' className={classes.eventBox}>
              <h2>Their Events: </h2>
              <Grid container className={classes.eventcard} spacing={2}>
                {data.otherEvents.length === 0 ? (
                  <div className={classes.introduction}>
                    No event at the moment, please wait:)
                  </div>
                ) : (
                  data.otherEvents.map((item) => {
                    return (
                      <Grid
                        item
                        xs={11}
                        md={6}
                        xl={4}
                        className={classes.eventItem}
                        key={item}
                      >
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
