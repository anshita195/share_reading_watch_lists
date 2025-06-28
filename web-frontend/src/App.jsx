import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Login from './pages/Login';
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper, TextField, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import './App.css'

function UsernamePrompt({ onSetUsername }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSetUsername(input.trim());
    }
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Welcome to Share Lists
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Enter your username to start tracking and sharing your reading and watch lists
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
            placeholder="Enter your username"
          />
          <Button type="submit" variant="contained" fullWidth size="large">
            Get Started
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

function App() {
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setUsername('');
  };

  if (!username) {
    return <UsernamePrompt onSetUsername={setUsername} />;
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
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login username={username} onLogout={handleLogout} onSetUsername={setUsername} />} />
      </Routes>
    </Router>
  );
}

export default App;
