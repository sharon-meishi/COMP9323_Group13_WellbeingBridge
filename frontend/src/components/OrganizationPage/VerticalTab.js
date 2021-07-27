import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Alert from '@material-ui/lab/Alert';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import EventIcon from '@material-ui/icons/Event';
import BarChartIcon from '@material-ui/icons/BarChart';
import Dashboard from './Dashboard';
import OrganizationForm from './OrganizationForm';
import ProfileEditForm from '../IndividualProfilePage/ProfileEditForm';
import OrgEventCard from './OrgEventCard';
import { getOrganizationDetails, getEventSummary } from '../api';

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
    minWidth: '180px',
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
    flexGrow: '40',
  },
  titleStyle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#26A69A',
  },
  eventBox: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '75%',
    alignItems: 'stretch',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  item: {
    width: '100%',
  },
}));

export default function VerticalTabs({ profileData, setUpdate }) {
  const classes = useStyles();
  const event_list = profileData.publishedEvent;
  const [value, setValue] = useState(0);
  const [preloadValues, setPreloadValues] = useState({});
  const [details, setDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [start, setStart] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [loadMore, setLoadMore] = useState(
    event_list.length > 3 ? true : false
  );
  const [end, setEnd] = useState(event_list.length > 3 ? 3 : event_list.length);

  const loadMoreHandler = () => {
    if (end + 3 >= event_list.length) {
      setEnd(event_list.length);
      setStart(end);
      setLoadMore(false);
    } else {
      setEnd(end + 3);
      setStart(start + 3);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        event_list.slice(start, end).map((id) => getEventSummary(id, true))
      );
      setEventList((prevEvents) => prevEvents.concat(data));
    };
    if (end > start) {
      fetchData();
    }
  }, [start]);

  useEffect(() => {
    setLoadMore(event_list.length > 3 ? true : false);
  }, [event_list]);

  useEffect(() => {
    const fetchData = async () => {
      const Data = await getOrganizationDetails(profileData.oId);
      if (Data[0] === 200) {
        setDetails(Data[1]);
        const processedData = {
          OrgName: Data[1].organizationName,
          Contact: Data[1].contact,
          OrganizationDetail: Data[1].details,
          OrganizationIntroduction: Data[1].introduction,
          OrganizationType: Data[1].organizationType,
          serviceList: Data[1].serviceList.map((x) => ({ service: x })),
          video: Data[1].video,
          websiteLink: Data[1].websiteLink,
        };
        setPreloadValues(processedData);
      } else {
        setErrorMsg(Data[1]);
      }
    };
    fetchData();
  }, [profileData.oId]);

  console.log(eventList)

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
          <Tab icon={<HomeIcon />} label='Edit Page' {...a11yProps(1)} />
          <Tab
            icon={<SettingsIcon />}
            label='Account Setting'
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0} className={classes.tabpanel}>
          <Dashboard profileData={profileData} />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabpanel}>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            flexDirection='column'
          >
            <div className={classes.eventBox}>
              {eventList.map((event) => (
                <OrgEventCard
                  key={event.eventId}
                  eventId={event.eventId}
                  eventName={event.name}
                  eventDate={event.date}
                  postcode={event.location.postcode}
                  introduction={event.introduction}
                  thumbnail={event.thumbnail}
                  bookedUser={event.bookedUser}
                  eventList={eventList}
                  setEventList={setEventList}
                />
              ))}
            </div>
            <Box>
              <Button
                color='primary'
                variant='contained'
                onClick={loadMoreHandler}
                disabled={!loadMore}
              >
                Load More
              </Button>
            </Box>
            {/* <EventDisplay profileData={profileData} /> */}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.tabpanel}>
          {details ? (
            <OrganizationForm
              oId={profileData.oId}
              preloadValues={preloadValues}
              preloadImg={details.logo}
            />
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={3} className={classes.tabpanel}>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            flexDirection='column'
          >
            <Typography className={classes.titleStyle}>
              Edit your Organization Name and Password
            </Typography>
            <ProfileEditForm
              currentName={profileData.organizationName}
              oId={profileData.oId}
              setUpdate={setUpdate}
            />
          </Box>
        </TabPanel>
      </div>
    </>
  );
}
