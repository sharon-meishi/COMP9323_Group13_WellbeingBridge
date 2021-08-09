// DeleteReminder component: confirmation notice when deleting
import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

function DeleteReminder({open, setOpen, handleDelete}) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size='small'
      style={{height: 'auto', position:'relative'}}
    >
        <Modal.Header>Delete your comment</Modal.Header>
        <Modal.Content>
            <p>Are you sure you want to delete your comment?</p>
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

export default DeleteReminder;
