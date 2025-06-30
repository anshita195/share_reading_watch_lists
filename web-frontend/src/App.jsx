import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Login from './pages/Login';
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper, TextField, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import './App.css'

function App() {
  const [username, setUsername] = useState('');

  // Sync frontend username with backend session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/session', { credentials: 'include' });
        const data = await res.json();
        if (data.logged_in && data.username) {
          setUsername(data.username);
        } else {
          setUsername('');
        }
      } catch (err) {
        setUsername('');
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', { method: 'GET', credentials: 'include' });
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      setUsername('');
    }
  };

  if (!username) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login username={username} onLogout={handleLogout} onSetUsername={setUsername} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Share Lists
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="inherit" sx={{ mr: 1 }}>
              Welcome, {username}!
            </Typography>
            <Button color="inherit" component={RouterLink} to="/feed">Feed</Button>
            <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              title="Logout"
              sx={{ ml: 1 }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile username={username} />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/feed" element={<Feed username={username} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login username={username} onLogout={handleLogout} onSetUsername={setUsername} />} />
      </Routes>
    </Router>
  );
}

export default App;
