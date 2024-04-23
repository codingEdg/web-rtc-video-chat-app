import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { SocketContext } from '../Context';


const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <Grid container sx={{ justifyContent: 'center', flexDirection: { xs: 'column' } }}>
  {/* <Typography variant="h2"  sx={{ fontSize: 14 }} color="text.secondary" >hello test file mpp</Typography> */}

    {stream && (
      <Paper sx={{ padding: '10px', border: '2px solid black', margin: '10px' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
          <video playsInline muted ref={myVideo} autoPlay sx={{ width: { xs: '300px', md: '550px' } }} />
        </Grid>
      </Paper>
    )}
    {callAccepted && !callEnded && (
      <Paper sx={{ padding: '10px', border: '2px solid black', margin: '10px' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
          <video playsInline ref={userVideo} autoPlay sx={{ width: { xs: '300px', md: '550px' } }} />
        </Grid>
      </Paper>
    )}
  </Grid>
  );
};

export default VideoPlayer;
