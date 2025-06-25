import { Container, Typography, Paper } from '@mui/material';

export default function Profile() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your tracked articles and videos will appear here.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          (Feature coming soon: summaries, sharing, and more!)
        </Typography>
      </Paper>
    </Container>
  );
} 