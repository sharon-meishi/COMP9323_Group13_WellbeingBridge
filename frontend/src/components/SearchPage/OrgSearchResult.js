import React from 'react';
import OrgCard from './OrgCard';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root:{
        display:'flex',
        justifyContent:'space-evenly',
        flexWrap:'wrap',
        margin:'2%',
        paddingBottom:'40%',//need be be changed

    }
});
function OrgSearchResult() {
    const classes = useStyles();
    return (
        <Grid className={classes.root}>
            <OrgCard/>
            <OrgCard/>
            <OrgCard/>
        </Grid>
    )
}

export default OrgSearchResult
