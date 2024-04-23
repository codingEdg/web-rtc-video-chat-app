import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import Assignment from '@mui/icons-material/Assignment'
import Phone from '@mui/icons-material/Phone'
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import {SocketContext} from "../Context"

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <Container sx={{
      width: { xs: '80%', md: '600px' },
      margin: '35px 0',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Paper elevation={10} sx={{ padding: '10px 20px', border: '2px solid black' }}>
        <form sx={{ display: 'flex', flexDirection: 'column' }} noValidate autoComplete="off">
          <Grid container sx={{ width: '100%', flexDirection: { xs: 'column' } }}>
            <Grid item xs={12} md={6} sx={{ padding: 20 }}>
              <Typography gutterBottom variant="h6">Account Info</Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <CopyToClipboard text={me} sx={{ marginTop: 20 }}>
                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6} sx={{ padding: 20 }}>
              <Typography gutterBottom variant="h6">Make a call</Typography>
              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabledIcon fontSize="large" />} fullWidth onClick={leaveCall} sx={{ marginTop: 20 }}>
                  Hang Up
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)} sx={{ marginTop: 20 }}>
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar;
