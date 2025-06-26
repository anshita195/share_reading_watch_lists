import { useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Chip, Button } from '@mui/material';

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
    summary: ''
  },
  {
    id: 4,
    type: 'video',
    title: 'The Future of AI: Panel Discussion',
    summary: ''
  }
];

export default function Profile() {
  const [items, setItems] = useState(mockTrackedItems);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setItems(imported.map((item, idx) => ({
          ...item,
          summary: typeof item.summary === 'string' ? item.summary : '',
          id: item.id || idx + 1
        })));
      } catch {
        alert('Invalid JSON file!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your tracked articles and videos:
        </Typography>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Import List
          <input type="file" accept="application/json" hidden onChange={handleImport} />
        </Button>
      </Paper>
      <Grid container spacing={3} justifyContent="center">
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ minHeight: 180 }}>
              <CardContent>
                <Chip label={item.type === 'article' ? 'Article' : 'Video'} color={item.type === 'article' ? 'primary' : 'secondary'} sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.summary && item.summary.trim() !== '' ? item.summary : <i>Summary coming soon...</i>}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
} 