import React, { useEffect, useState } from 'react';
import Scrollspy from 'react-scrollspy';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { getOrganizationDetails } from '../api';
import EventCard from '../EventCard';

const useStyles = makeStyles((theme) => ({
  scrollspy: {
    fontFamily: 'Noto sans',
    display: 'flex',
    flexDirection: 'column',
    margin: '10% 5%',
    position: 'fixed',
    top: 0,
    left: 0,
    fontWeight: '400'
  },
  menu: {
    listStyle: 'none',
  },
  item: {
    margin: '10px',
    fontWeight: 'bold',
    padding: '10px 0',
  },
  isCurrent: {
    fontWeight: 'bold',
    color: '#f1a07a',
  },
  content: {
    padding: '5% 10% 0 20%',
  },
  box: {
    display: 'flex'
  },
  logo: {
    width: '300px',
    height: '70px',
    margin: '0 0 20px 600px'
  },
  introduction: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: '20px',
    width: '950px'
  },
  service: {
    fontFamily: 'Noto Sans',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  eventcard: {
    display: 'flex'
  }
}));

function ScrollspyContent() {
  const classes = useStyles();
  const BottomSyle = {
    borderBottom: '3px solid rgba(0, 0, 0, 0.1)',
    marginBottom: '30px'
  }
  const [data, setData] = useState(null);
  const getOrganization = async () => {
    const res = await getOrganizationDetails('2');
    if (res[0] === 200) {
      setData(res[1]);
      console.log(data);
    } else {
      console.log('There is something wrong in getOrganization.')
    }
  }
  useEffect(() => getOrganization(), []);

  return (
    <div>
      <div className={classes.content}>
        <section id='Name' style={BottomSyle}>
          <div className={classes.box}>
            <h2 style={{paddingTop: '30px'}}>{data.organizationName}</h2>
            <img alt='logo' src={data.logo} className={classes.logo} />
          </div>
          <div className={classes.introduction}>{data.introduction}</div>
        </section>
        <section id='Details' style={BottomSyle}>
          <h2>Details</h2>
          <div className={classes.introduction}>{data.details}</div>
        </section>
        <section id='Service' style={BottomSyle}>
          <h2>Services: </h2>
          {data.serviceList.map((item) => {
            return (
              <div className={classes.service}>• {item}</div>
            )
          })
        }
        </section>
        <section id='Contact' style={BottomSyle}>
          <h2>Video:</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DxIDKZHW3-E" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </section>
        <section id='Events' style={BottomSyle}>
          <h2>Other Information:</h2>
          <div className={classes.service}>Contract: {data.contact}</div>
          <div className={classes.service}>Website Link: {data.websiteLink}</div>
        </section>
        <section id='Events' style={BottomSyle}>
          <h2>Their Events: </h2>
          <div className={classes.eventcard}>
            {data.otherEvents.map((item) => {
              return (
                <EventCard style={{marginLeft: '20px'}} eventId={item} />
              )
            })}
          </div>
        </section>
      </div>
      <Scrollspy
        className={classes.scrollspy}
        items={['Details', 'Services', 'Video', 'Contact', 'Events']}
        currentClassName={classes.isCurrent}
      >
        <Link className={classes.item} href='#Details' color='inherit'>
        Details
        </Link>
        <Link
          className={classes.item}
          href='#Services'
          color='inherit'
        >
          Services
        </Link>
        <Link className={classes.item} href='#Video' color='inherit' >
          Video
        </Link>
        <Link className={classes.item} href='#Contact' color='inherit' >
          Contact
        </Link>
        <Link className={classes.item} href='#Events' color='inherit' >
          Events
        </Link>
      </Scrollspy>
    </div>
  );
}

export default ScrollspyContent;
