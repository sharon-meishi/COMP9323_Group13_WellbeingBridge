import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Box from '@material-ui/core/Box';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'theme.palette.background.paper',
  },
  appBarStyle: {
    backgroundColor: '#D9F4F2',
  },
  tabs: {
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    '& .MuiSvgIcon-root': {
      marginRight: '3px',
    },
    '& .MuiTab-labelIcon':{
        minHeight: '55px'
    }
  },
  tabStyle: {
    color: 'black',
    width: '50%',
  },
  indicator: {
    backgroundColor: '#216991',
  },
  buttonContainer: {
    paddingTop: '10px',
    paddingBottom: '20px',
    alignSelf: 'center',
  },
}));

function ProfileTabMenu({FavEvents}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.appBarStyle}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='simple tabs example'
          classes={{
            indicator: classes.indicator,
          }}
          className={classes.tabs}
          centered
        >
          <Tab
            icon={<FavoriteBorderIcon />}
            label='My Favourites'
            {...a11yProps(0)}
            className={classes.tabStyle}
          />

          <Tab
            icon={<EventAvailableIcon />}
            label='My Bookings'
            {...a11yProps(1)}
            className={classes.tabStyle}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        My Favourites {FavEvents}
      </TabPanel>
      <TabPanel value={value} index={1}>
        My Bookings
      </TabPanel>
    </div>
  );
}

export default ProfileTabMenu;
