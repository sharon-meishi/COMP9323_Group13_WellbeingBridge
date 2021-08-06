import React, { useState } from 'react';
import { Form, Comment, Button } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import DeleteReminder from './DeleteReminder';
import { updateComment, deleteComment, updateAnswer } from '../api';

const useStyles = makeStyles(() => ({
  avatarStyle: {
    width: '2.5em',
    height: '2.5em',
    float: 'left',
    margin: '0.2em 0.2em',
  },
}));

function SingleComment({
  orgDetail,
  oId,
  orgName,
  content,
  eventId,
  setUpdate,
}) {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [editAnswer, setEditAnswer] = useState(false);
  const [comment, setComment] = useState(content.comment);
  const [answer, setAnswer] = useState(content.answer || '');
  const [open, setOpen] = useState(false);
  const isOrg =
    sessionStorage.getItem('usergroup') === 'organization' &&
    parseInt(sessionStorage.getItem('id')) === oId;
  const isAuthor =
    sessionStorage.getItem('usergroup') === 'individual' &&
    parseInt(sessionStorage.getItem('id')) === content.userId;
  const toggleAnswer = () => {
    setEditAnswer(!editAnswer);
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const toggleDelete = () => {
    setOpen(true);
    setEditMode(false)
  };

  const handleSubmit = async () => {
    const Data = await updateComment(eventId, comment, content.commentId);
    if (Data[0] === 200) {
      setEditMode(false);
      setUpdate(true);
    } else {
      console.log(Data[1]);
    }
  };

  const handleDelete = async () => {
    const Data = await deleteComment(eventId, content.commentId);
    if (Data[0] === 200) {
      setOpen(false);
      setUpdate(true);
    } else {
      console.log(Data[1]);
    }
  };

  const handleUpdateAnswer = async () => {
    const Data = await updateAnswer(eventId, content.commentId, answer);
    if (Data[0] === 200) {
      setEditAnswer(false);
      setUpdate(true);
    }
  };

  return (
    <Comment>
      {open ? (
        <DeleteReminder
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
              <Form.Field>
                <Form.TextArea
                  required
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
              </Form.Field>
              <Form.Button
                type='submit'
                color='blue'
                size='mini'
                floated='right'
                content='Save'
              />
            </Form>
          ) : (
            content.comment
          )}
        </Comment.Text>
        <Comment.Actions>
          {isOrg && !content.answer ? (
            <Comment.Action onClick={toggleAnswer}>{'Reply'}</Comment.Action>
          ) : null}
          {isAuthor ? (
            <>
              <Comment.Action onClick={toggleEdit}>{editMode ? 'Cancel Edit' : 'Edit'}</Comment.Action>
              <Comment.Action onClick={toggleDelete}>Delete</Comment.Action>
            </>
          ) : null}
        </Comment.Actions>
        {content.answer ? (
          <Comment.Group size='large'>
            <Comment>
              <Avatar
                className={classes.avatarStyle}
                variant='rounded'
                src={orgDetail.Logo}
              >
                {orgName.charAt(0).toUpperCase()}
              </Avatar>
              <Comment.Content style={{ marginLeft: '4em' }}>
                <Comment.Author as='span'>{orgName}</Comment.Author>
                <Comment.Text>{content.answer}</Comment.Text>
                <Comment.Actions>
                  {isOrg ? (
                    <Comment.Action onClick={toggleAnswer}>
                      {editAnswer ? 'Cancel Edit' : 'Edit Answer'}
                    </Comment.Action>
                  ) : null}
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        ) : null}
        {editAnswer ? (
          <Form reply onSubmit={handleUpdateAnswer}>
            <Form.TextArea
              placeholder='Please leave your answer here'
              name='answer'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
            <Box display='flex' justifyContent='flex-end'>
              <Button
                content={content.answer ? 'Save' :'Add Answer'}
                labelPosition='left'
                icon='edit'
                primary
              />
            </Box>
          </Form>
        ) : null}
      </Comment.Content>
    </Comment>
  );
}

export default SingleComment;
