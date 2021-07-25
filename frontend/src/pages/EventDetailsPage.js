import React, { useContext } from 'react';
import { AppContext } from '../utils/store';
import { makeStyles } from '@material-ui/core/styles';
import { Comment, Form } from 'semantic-ui-react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import { useHistory } from 'react-router-dom';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import CardActions from '@material-ui/core/CardActions';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EventCard from '../components/EventCard';
import NavBar from '../components/NavigationBar/NavBar';
import ShareModal from '../components/ShareModal';
import BookedUserTable from '../components/BookedUserTable';
import LoginModal from '../components/NavigationBar/LoginModal';
import Tooltip from '@material-ui/core/Tooltip';
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

const useStyles = makeStyles({
  card: {
    margin: '3% 10%',
    minWidth: 275,
    display: 'flex',
    flexDirection: 'column',
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
  },
  left: {
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
    width: '300px',
    height: '500px',
    objectFit:'contain',
  },
  org: {
    float: 'right',
    paddingRight: '5%',
  },
  info: {
    display: 'flex',
    width: '100%',
    paddingBottom: '5%',
    flexDirection: 'column',
    paddingTop: '5%',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
  },
  intro: {
    paddingTop: '5%',
    paddingBottom: '5%',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
  },
  more: {
    paddingTop: '5%',
    paddingBottom: '5%',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
  },
  recommendation:{
    display:'flex',
    flexDeriction:'row',
    flexWrap:'wrap',
  },
  comment: {
    padding: '5% 2% 5% ',
    borderBottomStyle: 'solid',
    borderWidth: '1px',
  },
});
function EventDetailsPage({ match }) {
  const classes = useStyles();
  const eventId = match.params.eventId;
  const [detail, setDetail] = React.useState({});
  const [islike, setIslike] = React.useState(false);
  const [isbook, setIsbook] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const [recomList, setRecomList] = React.useState([]);
  const [editable, setEditable] = React.useState(false);
  const [bookedUsers, setBookedUsers] = React.useState([]);
  const usergroup = sessionStorage.getItem('usergroup');
  const oid = sessionStorage.getItem('id');
  const [comment, setComment] = React.useState('');
  const [update, setUpdate] = React.useState(false);
  const context = useContext(AppContext);
  const history = useHistory();
  const token = sessionStorage.getItem('token');

  React.useEffect(() => {
    const getEvent = async () => {
      const res = await getEventDetails(eventId);
      if (res[0] === 200) {
        setDetail(res[1]);
        setRecomList(res[1].recommendation);
        setBookedUsers(res[1].bookedUser);
        console.log(res[1].bookedUser);
        console.log(res[1]);
        if (res[1].favourite) {
          console.log('initial liked');
          setIslike(true);
        }
        if (res[1].booked) {
          console.log('initial booked');
          setIsbook(true);
        }
      }
      if (usergroup === 'organization') {
        const orgDetail = await getOrganizationProfile(oid);
        console.log(orgDetail[1].publishedEvent[0]);
        console.log(eventId);
        console.log(orgDetail[1].publishedEvent.indexOf(Number(eventId)));
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
    }
    if (islike) {
      console.log('now it is liked');
      const res = await unlikeEvent(eventId);
      if (res[0] === 200) {
        setIslike(false);
        console.log('unlike success');
      } else {
        console.log('unlike error');
      }
    } else {
      console.log('now it is not liked');
      const res = await likeEvent(eventId);
      if (res[0] === 200) {
        setIslike(true);
        console.log('like success');
      } else {
        console.log('like error');
      }
    }
  };
  const handleShare = () => {
    setShare(true);
  }
  const handleBook = async () => {
    if (!token) {
      setOpenLogin(true);
    }
    if (isbook) {
      const res = await unbookEvent(eventId);
      if (res[0] === 200) {
        setIsbook(false);
        console.log('set unbook success');
      } else {
        console.log('set unbook error');
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

  return (
    <div>
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
      <ShareModal
        open={share}
        setShare={setShare}
        eventId={eventId}
      />
      <Card className={classes.card}>
        {/* <CardContent> */}
        <Grid className={classes.top}>
          <Grid className={classes.left}>
            <Grid className={classes.title}>
              <Typography variant='h4' component='h2'>
                {detail.eventName}
              </Typography>
              {usergroup === 'organization' ? (
                <CardActions>
                  {/* {editable ? 
                    <Tooltip title="Delete" placement="left"  >
                      <IconButton onClick={deleteEvent}>
                      <DeleteOutlinedIcon />
                      </IconButton>
                    </Tooltip> : null} */}
                  {editable ?                 
                    <Tooltip title="Edit" placement="right"  >
                      <IconButton onClick={editEvent}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip> : null}
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
                    {isbook ? (
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
              <IconButton onClick={handleShare} aria-label='share'>
                <Tooltip title="Share" placement="right">
                  <ShareIcon />
                </Tooltip>
              </IconButton>
            </Grid>
            <Typography variant='body1' className={classes.org}>
              By {detail.OrganizationName}
            </Typography>
            <Grid className={classes.info}>
              <Typography variant='body1' className={classes.org}>
                When: {detail.date}
              </Typography>
              <Typography variant='body1' className={classes.org}>
                What time: {detail.time}
              </Typography>
              <Typography variant='body1' className={classes.org}>
                Where: {detail.location ? detail.location.address : ''}
              </Typography>
            </Grid>
            <Grid className={classes.intro}>
              <Typography variant='h6'>Introduction:</Typography>
              <Typography variant='body1' className={classes.description}>
                {detail.introduction}
              </Typography>
            </Grid>
            <Grid className={classes.more}>
              <Typography variant='h6'>More about this event:</Typography>
              <Typography variant='body1' className={classes.description}>
                {detail.details}
              </Typography>
            </Grid>
            <Grid className={classes.comment}>
              <Typography variant='h6'>Comments:</Typography>
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
                        content='Add Reply'
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
            {usergroup?
              <Grid className={classes.bookedUser}>
               <Typography variant='h6'>Booked Users:</Typography>
               <BookedUserTable bookedUsers = {bookedUsers}/>        
              </Grid>: null}
            <Grid className={classes.recommendation}>
              <Typography variant='h6'>Recommendation:</Typography>
              {recomList.map((eventId) => (
                <EventCard key={eventId} eventId={eventId} />
              ))}
            </Grid>
          </Grid>
          <CardMedia className={classes.photo}>
            <img alt='event_image' src={detail.thumbnail} className={classes.photo}/>
          </CardMedia>
        </Grid>
      </Card>
    </div>
  );
}

export default EventDetailsPage;
