import { Container, Typography, Paper } from '@mui/material';

export default function Login() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Login / Signup</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Sign in to save and share your reading and watch lists.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          (Feature coming soon: authentication and user accounts!)
        </Typography>
      </Paper>
    </Container>
  );
} 