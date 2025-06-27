import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Login from './pages/Login';
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper, TextField } from '@mui/material';
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
        <Typography variant="h5" gutterBottom>Enter your username</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>Continue</Button>
        </form>
      </Paper>
    </Container>
  );
}

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  if (!username) {
    return <UsernamePrompt onSetUsername={setUsername} />;
  }

  // You can pass username as a prop or context to pages if needed
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
        <Route path="/profile" element={<Profile username={username} />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
