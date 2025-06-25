import { Container, Typography, Paper } from '@mui/material';

export default function Feed() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Community Feed</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          See what others are reading and watching!
        </Typography>
        <Typography variant="body2" color="text.disabled">
          (Feature coming soon: follow users, discover new content, and more!)
        </Typography>
      </Paper>
    </Container>
  );
} 