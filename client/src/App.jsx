import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
// import Notification from './components/Notification';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';

const App = () => {
  return (
    <div sx={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar  >
        <Typography variant="h2" align="center">
          Video Chat App
        </Typography>
      </AppBar>
    <VideoPlayer />
    <Sidebar >

    </Sidebar>
     
      
    </div>
  );
};

export default App;
