import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    videoResponsive : {
        overflow: 'hidden',
        paddingBottom: '56.25%',
        position: 'relative',
        height: '0',
      },
      frame: {
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        position: 'absolute'
      }
}))

function YoutubeVideo({vId}) {
    const classes = useStyles();
    return (
        <div className={classes.videoResponsive}>
        <iframe
        className={classes.frame}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${vId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    )
}

export default YoutubeVideo
