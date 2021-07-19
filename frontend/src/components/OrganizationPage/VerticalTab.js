import React, { useState,  useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import BarChartIcon from '@material-ui/icons/BarChart';
import Dashboard from './Dashboard'
import OrganizationForm from './OrganizationForm'
import EventDisplay from './EventDisplay'
import ProfileEditForm from '../ProfileEditForm'
import {getOrganizationDetails} from '../api'

function FetchAlert(props) {
  return <Alert elevation={6} variant='filled' {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
  },
  tabs: {
    paddingTop: '30px',
    height: '100%',
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    '& .MuiSvgIcon-root': {
      marginRight: '3px',
    },
  },
  indicator: {
    backgroundColor: '#26A69A',
  },
  tabpanel: {
    flexGrow: '40'
  },
  titleStyle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#26A69A',
  },
}));

export default function VerticalTabs({profileData}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [details, setDetails] = useState('')
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(profileData.oId)
    const fetchData = async() => {
      const Data = await getOrganizationDetails(profileData.oId)
      if (Data[0] === 200){
        console.log(Data[1]);
        setDetails(Data[1])
      }
      else{
        setErrorMsg(Data[1])
      }
    }
    fetchData()
  }, [])

  return (
    <>
    {errorMsg ? <FetchAlert severity='error'>{errorMsg}</FetchAlert> : null}
    <div className={classes.root}>
      
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        className={classes.tabs}
        classes={{
          indicator: classes.indicator,
        }}
      >
        <Tab icon={<BarChartIcon />} label='DashBoard' {...a11yProps(0)} />

        <Tab icon={<EventIcon />} label='My Events' {...a11yProps(2)} />
        <Tab icon={<HomeIcon />} label='Organization Page' {...a11yProps(1)} />
        <Tab
          icon={<SettingsIcon />}
          label='Account Setting'
          {...a11yProps(3)}
        />
      </Tabs>
      <TabPanel value={value} index={0} className={classes.tabpanel}>
        <Dashboard profileData={profileData}/>
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabpanel}>
      <EventDisplay profileData={profileData}/>
        
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabpanel}>
      <OrganizationForm profileData={profileData}/>
      </TabPanel>
      <TabPanel value={value} index={3} className={classes.tabpanel}>
        <Box display='flex' justifyContent='center' alignItems='center' width='100%' flexDirection='column'>
          <Typography className={classes.titleStyle}>Edit your Organization Name and Password</Typography>
        <ProfileEditForm currentName={profileData.organizationName} oId={profileData.oId}/>
        </Box>
        
      </TabPanel>
    </div>
    </>
  );
}
