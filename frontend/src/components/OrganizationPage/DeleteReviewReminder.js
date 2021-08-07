import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

function DeleteReviewReminder({open, setOpen, handleDelete}) {


  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      style={{height: 'auto', position:'relative'}}
    >
        <Modal.Header>Delete your review</Modal.Header>
        <Modal.Content>
            <p>Are you sure you want to delete your review?</p>
        </Modal.Content>
        <Modal.Actions>
            <Button  positive onClick={()=>setOpen(false)}>
                No
            </Button>
            <Button  negative onClick={handleDelete}>
                Yes
            </Button>
        </Modal.Actions>
    </Modal>
  );
}

export default DeleteReviewReminder;
