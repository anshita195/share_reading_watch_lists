import { Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        Share Reading & Watch Lists
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Effortlessly track, summarize, and share your reading and watch history.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button component={Link} to="/feed" variant="contained">Go to Feed</Button>
        <Button component={Link} to="/profile" variant="outlined">My Profile</Button>
        <Button component={Link} to="/login" variant="text">Login</Button>
      </Stack>
    </Container>
  );
} 