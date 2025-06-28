import { useState } from 'react';
import { Container, Typography, Paper, Button, TextField, Box, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Login({ username, onLogout, onSetUsername }) {
  const [newUsername, setNewUsername] = useState('');
  const [showChangeForm, setShowChangeForm] = useState(false);

  const handleChangeUsername = (e) => {
    e.preventDefault();
    if (newUsername.trim()) {
      onSetUsername(newUsername.trim());
      setNewUsername('');
      setShowChangeForm(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Account Settings
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current User
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Logged in as: <strong>{username}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Username
          </Typography>
          {!showChangeForm ? (
            <Button 
              variant="outlined" 
              onClick={() => setShowChangeForm(true)}
              sx={{ mt: 1 }}
            >
              Change Username
            </Button>
          ) : (
            <form onSubmit={handleChangeUsername}>
              <TextField
                label="New Username"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                fullWidth
                autoFocus
                sx={{ mb: 2 }}
                placeholder="Enter new username"
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Button type="submit" variant="contained">
                  Update Username
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setShowChangeForm(false);
                    setNewUsername('');
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Logout
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sign out of your current session
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.disabled">
          Note: This is a local app. Your data is stored in your browser and extension.
        </Typography>
      </Paper>
    </Container>
  );
} 