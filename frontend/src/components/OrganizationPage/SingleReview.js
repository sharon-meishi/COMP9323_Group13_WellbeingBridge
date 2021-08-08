import React, { useState } from 'react';
import { Form, Comment } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import DeleteReviewReminder from './DeleteReviewReminder';
import { updateReview, deleteReview } from '../api';

const labels = {
  1: 'Worst',
  2: 'Poor',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

const useStyles = makeStyles(() => ({
  avatarStyle: {
    width: '2.5em',
    height: '2.5em',
    float: 'left',
    margin: '0.2em 0.2em',
  },
}));

function SingleReview({ content, oId, setUpdate }) {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [rating, setRating] = useState(content.rating);
  const [review, setReview] = useState(content.review);
  const [open, setOpen] = useState(false);
  const [ratingHover, setRatingHover] = useState(-1);

  const isAuthor =
    sessionStorage.getItem('usergroup') === 'individual' &&
    parseInt(sessionStorage.getItem('id')) === content.userId;

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const toggleDelete = () => {
    setOpen(true);
    setEditMode(false);
  };

  const handleSubmit = async () => {
    const Data = await updateReview(oId, rating, review, content.reviewId);
    if (Data[0] === 200) {
      setEditMode(false);
      setUpdate(true);
    } else {
      console.log(Data[1]);
    }
  };

  const handleDelete = async () => {
    const Data = await deleteReview(oId, content.reviewId);
    if (Data[0] === 200) {
      setOpen(false);
      setUpdate(true);
    } else {
      console.log(Data[1]);
    }
  };

  return (
    <Comment>
      {open ? (
        <DeleteReviewReminder
          open={open}
          setOpen={setOpen}
          handleDelete={handleDelete}
        />
      ) : null}
      <Avatar className={classes.avatarStyle} variant='rounded'>
        {content.username.charAt(0).toUpperCase()}
      </Avatar>
      <Comment.Content style={{ marginLeft: '4em' }}>
        <Comment.Author as='span'>{content.username}</Comment.Author>
        <Comment.Metadata>
          <div>{content.published}</div>
        </Comment.Metadata>
        <Comment.Text>
          {editMode ? (
            <Form onSubmit={handleSubmit}>
              <Box display='flex' mb={1} height='100%'>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => {
                    if (!newValue) {
                      setRating(1);
                    } else {
                      setRating(newValue);
                    }
                  }}
                  onChangeActive={(event, newHover) => {
                    setRatingHover(newHover);
                  }}
                />
                {rating !== null && (
                  <Box ml={2}>
                    {labels[ratingHover !== -1 ? ratingHover : rating]}
                  </Box>
                )}
              </Box>
              <Form.Field>
                <Form.TextArea
                  required
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                  }}
                />
              </Form.Field>
              <Form.Button
                type='submit'
                color='blue'
                size='mini'
                floated='right'
                content='Save'
                style={{ marginTop: '5px' }}
              />
            </Form>
          ) : (
            <Box>
              <Box>
                <Rating readOnly value={content.rating} />
              </Box>
              <Box>{content.review}</Box>
            </Box>
          )}
        </Comment.Text>
        <Comment.Actions>
          {isAuthor ? (
            <>
              {/* <Comment.Action onClick={toggleEdit}>
                {editMode ? 'Cancel Edit' : 'Edit'}
              </Comment.Action> */}
              <Comment.Action onClick={toggleDelete}>Delete</Comment.Action>
            </>
          ) : null}
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );
}

export default SingleReview;
