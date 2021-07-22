import React, { useState } from 'react';
import { Form, Comment } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import DeleteReminder from './DeleteReminder';
import { updateComment, deleteComment } from '../api';

const useStyles = makeStyles(() => ({
  avatarStyle: {
    width: '2.5em',
    height: '2.5em',
    float: 'left',
    margin: '0.2em 0.2em',
  },
}));

function SingleComment({ content, eventId, setUpdate }) {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState(content.comment);
  const [open, setOpen] = useState(false);

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const toggleDelete = () => {
    setOpen(true);
  };

  const handleSubmit = async () => {
    console.log(comment);
    const Data = await updateComment(eventId, comment, content.commentId)
    if (Data[0] === 200){
        setEditMode(false);
        setUpdate(true);
    }else{
        console.log(Data[1])
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
        {content.username.charAt(0)}
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
        {sessionStorage.getItem('id') == content.userId ? (
            <Comment.Actions>
              <Comment.Action onClick={toggleEdit}>Edit</Comment.Action>
              <Comment.Action onClick={toggleDelete}>Delete</Comment.Action>
            </Comment.Actions>
          ) : null}
      </Comment.Content>
    </Comment>
  );
}

export default SingleComment;
