import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Login from './pages/Login';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import './App.css'

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Share Lists
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/feed">Feed</Button>
            <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
