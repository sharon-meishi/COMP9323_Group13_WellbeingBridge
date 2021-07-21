import React, { useState } from 'react';
import { Form, Comment } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core/styles';
import DeleteReminder from './DeleteReminder';
import { Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
    // const Data = await updateComment(recipeId, comment, content.comment_id)
    // if (Data[0] === 200){
    //     setEditMode(false);
    //     setUpdate(true);
    // }else{
    //     console.log(Data[1])
    // }
  };

  const handleDelete = async () => {
    console.log('confirm delete');
    setOpen(false);
    // const Data = await deleteComment(recipeId, content.comment_id);
    // if (Data[0] === 200) {
    //   setOpen(false);
    //   setUpdate(true);
    // } else {
    //   console.log(Data[1]);
    // }
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
        {sessionStorage.getItem('id') === content.userId ? (
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
