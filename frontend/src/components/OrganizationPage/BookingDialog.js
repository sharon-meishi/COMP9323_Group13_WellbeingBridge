import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles({
  itemStyle: {
    width:'50%',
    textAlign: 'center',
    fontSize: '16px'
  },
  titleStyle: {
    width:'50%',
    textAlign: 'center',
    fontWeight:'bold',
    fontSize:'18px'
  },
  boldStyle: {
    fontWeight:'bold',
    fontSize:'22px'
  }
})


export default function BookingDialog(props) {
  const { onClose, open, info, eventName} = props;
  const classes = useStyles()
  console.log(info)
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle disableTypography id="simple-dialog-title" className={classes.boldStyle}>Users who have booked event '{eventName}'</DialogTitle>
      <List>
        <ListItem>
            <ListItemText disableTypography primary='username' className={classes.titleStyle}/>
            <ListItemText disableTypography primary='email' className={classes.titleStyle}/>
          </ListItem>
        {info.map((user) => (
          <ListItem key={user.email}>
            <ListItemText disableTypography  primary={user.username} className={classes.itemStyle}/>
            <Link disableTypography className={classes.itemStyle} style={{cursor: 'pointer'}} href={`mailto:${user.email}`}>{user.email}</Link>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

BookingDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
