import { useState } from 'react';
import { Container, Typography, Paper, Button, TextField, Box, Divider, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Login({ username, onLogout, onSetUsername }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(mode === 'login' ? 'Logged in successfully!' : 'Registered successfully!');
        onSetUsername(form.username);
        setForm({ username: '', password: '' });
      } else {
        setError(data.error || 'Error');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await fetch('http://127.0.0.1:5000/logout', { method: 'GET', credentials: 'include' });
      onLogout();
    } catch {
      setError('Logout failed');
    }
    setLoading(false);
  };

  if (!username) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            {mode === 'login' ? 'Login' : 'Register'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              autoFocus
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mb: 2 }}>
              {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
            </Button>
          </form>
          <Divider sx={{ my: 2 }} />
          <Button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}>
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Button>
        </Paper>
      </Container>
    );
  }

  // If logged in
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Logged in as: <strong>{username}</strong>
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          disabled={loading}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
} 