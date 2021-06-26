import React from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles';
import bg1 from '../../Assets/new1.jpeg';


const useStyles = makeStyles({
    root: {
      backgroundImage: 'url(' + bg1 + ')',
      backgroundSize: 'cover',
      height:'350px',
      marginLeft: '100px',
      marginRight: '100px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignContent: 'center'
    },
    boxStyle: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '16px',
        backgroundColor: '#4A6B79',
        opacity: '0.9',
        color: 'white',
        padding: '16px',
        width: '50%',
        alignItems: 'flex-start',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderLeft:'7px solid #C5EDE9'
    },
    liStyle : {
        '&::marker': {
            color: '#C5EDE9'
        },
        textAlign: 'left'
    }
  });

function NewsItem(props) {
    const classes = useStyles(props);

    return (
            <Card className={classes.root} >
                
                <Box className={classes.boxStyle}>
                    <h1>Get health information and advice</h1>
                    <ul>
                        <li className={classes.liStyle}>Book your COVID-19 vaccination</li>
                        <li className={classes.liStyle}>More about COVID-19</li>
                        <li className={classes.liStyle}>About opioid medicines and pain</li>
                    </ul>
                </Box>
            </Card>
    )
}

export default NewsItem

