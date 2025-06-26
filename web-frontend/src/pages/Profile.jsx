import { Container, Typography, Paper, Grid, Card, CardContent, Chip } from '@mui/material';

const mockTrackedItems = [
  {
    id: 1,
    type: 'article',
    title: 'How LLMs are Changing the Web',
    summary: 'A deep dive into the impact of large language models on modern web applications.'
  },
  {
    id: 2,
    type: 'video',
    title: 'Understanding React in 15 Minutes',
    summary: 'A quick video tutorial on the basics of React and component-driven development.'
  },
  {
    id: 3,
    type: 'article',
    title: '10 Must-Read Books for Developers',
    summary: 'A curated list of books every developer should read to level up their skills.'
  },
  {
    id: 4,
    type: 'video',
    title: 'The Future of AI: Panel Discussion',
    summary: 'Experts discuss the future of artificial intelligence and its societal impact.'
  }
];

export default function Profile() {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your tracked articles and videos:
        </Typography>
      </Paper>
      <Grid container spacing={3} justifyContent="center">
        {mockTrackedItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ minHeight: 180 }}>
              <CardContent>
                <Chip label={item.type === 'article' ? 'Article' : 'Video'} color={item.type === 'article' ? 'primary' : 'secondary'} sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">{item.summary}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 