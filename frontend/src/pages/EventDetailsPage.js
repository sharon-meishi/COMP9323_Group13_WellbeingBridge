import React, { useContext } from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import EventCard from '../components/EventCard';
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
  getOrganizationProfile,
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
  },
  recommendation: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    paddingTop: '3%',
    paddingBottom: '3%',
  },
  orgLink: {
    cursor: 'pointer',
    marginLeft: '3px',
  },
  eventBox: {
    justifyContent: 'space-between',
  },
}));

function EventDetailsPage({ match }) {
  const eventId = match.params.eventId;
  const classes = useStyles();
  const history = useHistory();
  const context = useContext(AppContext);
  const [detail, setDetail] = React.useState({});
  const [islike, setIslike] = React.useState(false);
  const [isbook, setIsbook] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const [recomList, setRecomList] = React.useState([]);
  const [editable, setEditable] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const currentTime = new Date();

  const usergroup = sessionStorage.getItem('usergroup');
  const oid = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');

  const parsedDate = (dateString, format) => {
    return parse(dateString, format, new Date());
  };

  React.useEffect(() => {
    const getEvent = async () => {
      const res = await getEventDetails(eventId);
      if (res[0] === 200) {
        console.log(res[1]);
        setDetail(res[1]);
        setRecomList(res[1].recommendation);
        // setBookedUsers(res[1].bookedUser);
        // console.log(res[1].bookedUser);
        // console.log(res[1]);
        if (res[1].favourite) {
          setIslike(true);
        }
        if (res[1].booked) {
          setIsbook(true);
        }
      }
      if (usergroup === 'organization') {
        const orgDetail = await getOrganizationProfile(oid);
        // console.log(orgDetail[1].publishedEvent[0]);
        // console.log(eventId);
        // console.log(orgDetail[1].publishedEvent.indexOf(Number(eventId)));
        if (orgDetail[1].publishedEvent.indexOf(Number(eventId)) >= 0) {
          console.log('set Editable True');
          setEditable(true);
        }
      }
    };
    getEvent();
    setUpdate(false);
  }, [eventId, oid, usergroup, update]);

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
        // console.log('unlike success');
      } else {
        console.log('unlike error');
      }
    } else {
      console.log('now it is not liked');
      const res = await likeEvent(eventId);
      if (res[0] === 200) {
        setIslike(true);
        // console.log('like success');
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
    console.log(comment);
    const Data = await postComment(eventId, comment);
    if (Data[0] === 200) {
      setComment('');
      setUpdate(true);
    }
  };

  const toOrgPage = () => {
    history.push(`/organization/${detail.OrganizationId}`);
  };

  return (
    <div>
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
            <Box alignSelf='flex-end'>
              <div variant='body1'>
                By
                <Link
                  color='inherit'
                  underline='always'
                  onClick={toOrgPage}
                  className={classes.orgLink}
                >
                  {detail.OrganizationName}
                </Link>
              </div>
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
              <div variant='body1' className={classes.org}>
                <Header as='h4'> Where:</Header>
                {detail.location ? detail.location.address : ''}
              </div>
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
              <Header as='h3'> Comments:</Header>
              <Comment.Group size='large' style={{ maxWidth: '100%' }}>
                {context.isLoginState &&
                sessionStorage.getItem('usergroup') === 'individual' ? (
                  <Form onSubmit={submitNewComment}>
                    <Form.TextArea
                      placeholder='Please leave your comment here'
                      name='comment'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                    <Box display='flex' justifyContent='flex-end'>
                      <Form.Button
                        size='tiny'
                        content='Add Comment'
                        labelPosition='left'
                        icon='edit'
                        primary
                      />
                    </Box>
                  </Form>
                ) : (
                  <div>Please Login as an individual user to post comment</div>
                )}
                {detail.comments
                  ? detail.comments.map((eachComment, idx) => {
                      return (
                        <SingleComment
                          key={idx}
                          content={eachComment}
                          eventId={eventId}
                          setUpdate={setUpdate}
                        />
                      );
                    })
                  : null}
              </Comment.Group>
            </Grid>
            {/* {usergroup ? (
              <Grid className={classes.bookedUser}>
                <Typography variant='h6'>Booked Users:</Typography>
                <BookedUserTable bookedUsers={bookedUsers} />
              </Grid>
            ) : null} */}
            <Grid container className={classes.recommendation}>
              <Header as='h3'> Recommendation:</Header>
              <Grid container item width='100%' spacing={5}>
                {recomList.map((eventId) => (
                  <Grid item xs={11} md={6} lg={4}>
                    <EventCard key={eventId} eventId={eventId} />
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
