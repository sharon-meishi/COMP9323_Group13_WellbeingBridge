import React, { useState, useEffect, useContext } from 'react';
import parse from 'date-fns/parse';
import { AppContext } from '../utils/store';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Comment, Form, Header } from 'semantic-ui-react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Rating from '@material-ui/lab/Rating';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import EventCard from '../components/EventCard';
import LoadingBackdrop from '../components/LoadingBackdrop';
import BackToTop from '../components/BackToTop';
import NavBar from '../components/NavigationBar/NavBar';
import ShareModal from '../components/ShareModal';
import LoginModal from '../components/NavigationBar/LoginModal';
import RegisterModal from '../components/NavigationBar/RegisterModal';
import SingleComment from '../components/EventDetailPage/SingleComment';
import {
  getEventDetails,
  likeEvent,
  unlikeEvent,
  bookEvent,
  unbookEvent,
  postComment,
  getOrgSummary,
} from '../components/api';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 275,
    margin: '3% 10%',
    fontFamily: 'Lato,"Helvetica Neue",Arial,Helvetica,sans-serif',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
    },
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    margin: '3%',
    width: '60%',
    height: '50%',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    // backgroundColor :'green',
  },
  actions: {
    display: 'flex',
  },
  like: {
    marginLeft: '5%',
    alignItems: 'start',
  },
  isbook: {
    '&:hover': {
      backgroundColor: '#166b3d',
      // boxShadow: 'none',
    },
    color: 'white',
    backgroundColor: 'green',
    height: '35px',
    margin: '1.5% 10%',
  },
  notbook: {
    color: 'green',
    borderColor: 'green',
    // backgroundColor:'green',

    height: '35px',
    margin: '1.5% 10%',
  },
  notfavourite: {
    backgroundColor: 'white',
    borderWidth: '1px',
  },
  photo: {
    overflow: 'hidden',
    width: '350px',
    // height: '500px',
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
  },
  org: {
    display: 'flex',
    alignItems: 'baseline',
    fontSize: '16px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingTop: '1%',
    paddingBottom: '3%',
    borderBottom: '1px solid #DCDCDC',
  },
  sectionStyle: {
    paddingTop: '3%',
    paddingBottom: '3%',
    borderBottom: '1px solid #DCDCDC',
    fontSize: '16px',
  },
  recommendation: {
    width:'150%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  orgLink: {
    cursor: 'pointer',
    marginLeft: '3px',
    fontWeight: 'bold',
  },
  eventBox: {
    justifyContent: 'space-between',
  },
}));

function EventDetailsPage(props) {
  const eventId = props.match.params.eventId;
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AppContext);
  const [detail, setDetail] = useState({});
  const [orgDetail, setOrgDetail] = useState({});
  const [islike, setIslike] = useState(false);
  const [isbook, setIsbook] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [share, setShare] = useState(false);
  const [recomList, setRecomList] = useState([]);
  const [editable, setEditable] = useState(false);
  const [comment, setComment] = useState('');
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentTime = new Date();
  const token = sessionStorage.getItem('token');
  const usergroup = sessionStorage.getItem('usergroup');

  const parsedDate = (dateString, format) => {
    return parse(dateString, format, new Date());
  };

  useEffect(() => {
    const getEvent = async () => {
      console.log(eventId);
      const res = await getEventDetails(eventId);
      if (res[0] === 200) {
        setDetail(res[1]);
        setRecomList(res[1].recommendation);
        if (
          parseInt(sessionStorage.getItem('id')) === res[1].OrganizationId &&
          usergroup === 'organization'
        ) {
          setEditable(true);
        }
        if (res[1].favourite) {
          console.log(res[1].favourite);
          setIslike(true);
        } else {
          setIslike(false);
        }
        if (res[1].booked) {
          console.log(res[1].booked);
          setIsbook(true);
        } else {
          setIsbook(false);
        }
      }
    };
    getEvent();
    setUpdate(false);
  }, [eventId, update, usergroup]); 

  useEffect(() => {
    const fetchOrgData = async () => {
      const Data = await getOrgSummary(detail.OrganizationId);
      if (Data[0] === 200) {
        setOrgDetail(Data[1]);
      }
    };
    if (Object.keys(detail).length !== 0) {
      fetchOrgData();
    }
  }, [detail]);

  const editEvent = () => {
    history.push(`/event/edit/${eventId}`);
  };

  const handleLike = async () => {
    if (!token) {
      setOpenLogin(true);
      return;
    }
    if (islike) {
      const res = await unlikeEvent(eventId);
      if (res[0] === 200) {
        setIslike(false);
      } else {
        console.log('unlike error');
      }
    } else {
      console.log('now it is not liked');
      const res = await likeEvent(eventId);
      if (res[0] === 200) {
        setIslike(true);
      } else {
        console.log('like error');
      }
    }
  };

  const handleShare = () => {
    setShare(true);
  };

  const handleBook = async () => {
    if (!token) {
      setOpenLogin(true);
      return;
    }
    if (isbook) {
      const res = await unbookEvent(eventId);
      if (res[0] === 200) {
        setIsbook(false);
        // console.log('set unbook success');
      } else {
        // console.log('set unbook error');
      }
    } else {
      const res = await bookEvent(eventId);
      if (res[0] === 200) {
        setIsbook(true);
        console.log('set book success');
      } else {
        console.log('set book error');
      }
    }
  };

  const submitNewComment = async () => {
    setLoading(true)
    const Data = await postComment(eventId, comment);
    if (Data[0] === 200) {
      setLoading(false)
      setComment('');
      setUpdate(true);
    }
  };

  const toOrgPage = () => {
    history.push(`/organization/${detail.OrganizationId}`);
  };

  const searchCategory = () => {
    const queryData = { category: detail.category };
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };

  const searchFormat = () => {
    const queryData = { format: detail.format };
    const queryPath = new URLSearchParams(queryData).toString();
    const path = {
      pathname: '/event/search',
      search: `?${queryPath}`,
    };
    history.push(path);
  };

  return (
    <div>
      <LoadingBackdrop open={loading}/>
      <BackToTop showBelow={250} />
      <NavBar />
      {openLogin ? (
        <LoginModal
          open={openLogin}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      {openRegister ? (
        <RegisterModal
          open={openRegister}
          setOpenLogin={setOpenLogin}
          setOpenRegister={setOpenRegister}
        />
      ) : null}
      <ShareModal open={share} setShare={setShare} eventId={eventId} />
      <Card className={classes.card}>
        {/* <CardContent> */}
        <Grid container className={classes.top}>
          <Grid className={classes.left}>
            <Grid className={classes.title}>
              <Box display='flex' alignItems='baseline'>
                <Header as='h1'>{detail.eventName}</Header>
                <IconButton onClick={handleShare} aria-label='share'>
                  <Tooltip title='Share' placement='right'>
                    <ShareIcon />
                  </Tooltip>
                </IconButton>
              </Box>
              {usergroup === 'organization' ? (
                <CardActions>
                  {editable ? (
                    <Tooltip title='Edit' placement='right'>
                      <IconButton onClick={editEvent}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </CardActions>
              ) : (
                <CardActions className={classes.actions} disableSpacing>
                  <IconButton
                    className={classes.like}
                    onClick={handleLike}
                    aria-label='add to favorites'
                  >
                    {islike ? (
                      <FavoriteIcon color='secondary' fontSize='medium' />
                    ) : (
                      <FavoriteIcon color='disabled' fontSize='medium' />
                    )}
                  </IconButton>
                  <div
                    className={classes.book}
                    onClick={handleBook}
                    aria-label='add to favorites'
                  >
                    {currentTime > parsedDate(detail.enddate, 'dd/MM/yyyy') ? (
                      <Button
                        variant='contained'
                        className={classes.isbook}
                        disabled
                      >
                        Expired
                      </Button>
                    ) : isbook ? (
                      <Button variant='contained' className={classes.isbook}>
                        UNBOOK
                      </Button>
                    ) : (
                      <Button variant='outlined' className={classes.notbook}>
                        BOOK
                      </Button>
                    )}
                  </div>
                </CardActions>
              )}
            </Grid>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Box>
                <Chip
                  label={`#${detail.format}`}
                  clickable
                  color='primary'
                  onClick={searchFormat}
                  style={{ marginRight: '5px' }}
                />
                <Chip
                  label={`#${detail.category}`}
                  clickable
                  color='primary'
                  onClick={searchCategory}
                />
              </Box>
              <Box alignSelf='flex-end' display='flex'>
                <Box fontSize='18px'>
                  By
                  <Link
                    color='inherit'
                    underline='always'
                    onClick={toOrgPage}
                    className={classes.orgLink}
                  >
                    {detail.OrganizationName}
                  </Link>
                </Box>
                <Box>
                <Rating key={`rating${orgDetail.rating}`} value={orgDetail.rating} readOnly precision={0.5} />
                </Box>

              </Box>
            </Box>
            <Grid className={classes.info}>
              <div className={classes.org}>
                <Header as='h4'> When:</Header>
                {detail.startdate} to {detail.enddate}
              </div>
              <div variant='body1' className={classes.org}>
                <Header as='h4'> What time:</Header>
                {detail.time}
              </div>
              {detail.location ? (
                <div variant='body1' className={classes.org}>
                  <Header as='h4'> Where:</Header>
                  {detail.location.address || detail.format}
                </div>
              ) : null}
            </Grid>
            <Grid className={classes.sectionStyle}>
              <Header as='h3'> Introduction:</Header>
              <div variant='body1'>{detail.introduction}</div>
            </Grid>
            <Grid className={classes.sectionStyle}>
              <Header as='h3'> More about this event:</Header>
              <div variant='body1'>{detail.details}</div>
            </Grid>
            <Grid className={classes.sectionStyle}>
              <Header as='h3'> Q&A:</Header>
              <Comment.Group size='large' style={{ maxWidth: '100%' }}>
                {context.isLoginState &&
                sessionStorage.getItem('usergroup') === 'individual' ? (
                  <Form onSubmit={submitNewComment}>
                    <Form.TextArea
                      placeholder='Please leave your questions here'
                      name='comment'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                    <Box display='flex' justifyContent='flex-end'>
                      <Form.Button
                        type='submit'
                        size='tiny'
                        content='Add Question'
                        labelPosition='left'
                        icon='edit'
                        primary
                      />
                    </Box>
                  </Form>
                ) : (
                  <Box fontSize='16px'>
                    Please Login as an individual user to post question
                  </Box>
                )}
                {detail.comments && orgDetail
                  ? detail.comments.map((eachComment, idx) => {
                      return (
                        <SingleComment
                          key={idx}
                          content={eachComment}
                          eventId={eventId}
                          setUpdate={setUpdate}
                          oId={detail.OrganizationId}
                          orgName={detail.OrganizationName}
                          orgDetail={orgDetail}
                          setLoading={setLoading}
                        />
                      );
                    })
                  : null}
              </Comment.Group>
            </Grid>
            <Grid container className={classes.recommendation}>
              <Header as='h3'> Recommendation:</Header>
              <Grid container item width='150%' spacing={4}>
                {recomList.map((eventId) => (
                  <Grid item xs={11} md={6} lg={4} key={eventId}>
                    <EventCard eventId={eventId} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <CardMedia className={classes.photo}>
            <img
              alt='event_image'
              src={detail.thumbnail}
              className={classes.photo}
            />
          </CardMedia>
        </Grid>
      </Card>
    </div>
  );
}

export default EventDetailsPage;
