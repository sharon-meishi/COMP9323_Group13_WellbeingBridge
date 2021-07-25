import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(({
    search:{
        width: '100%',
        backgroundColor: '#D9F4F2',
        height: '30px'
    }
}))

function EventSearch() {
    const classes = useStyles()
    return (
        <>
            <Box className={classes.search}>
                lala
            </Box>
        </>
    )
}

export default EventSearch
