import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Chip, Button, CircularProgress, Alert } from '@mui/material';

export default function Profile({ username }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/${encodeURIComponent(username)}/items`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError('Could not load your tracked items.');
      }
      setLoading(false);
    }
    fetchItems();
  }, [username]);

  const handleSummarizeAll = async () => {
    setSummarizing(true);
    const updatedItems = await Promise.all(items.map(async (item) => {
      if (item.summary && item.summary.trim() !== '') return item;
      try {
        const response = await fetch('http://127.0.0.1:5000/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: item.title })
        });
        const data = await response.json();
        return { ...item, summary: data.summary || '' };
      } catch (err) {
        return { ...item, summary: 'Error summarizing.' };
      }
    }));
    setItems(updatedItems);
    setSummarizing(false);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Your tracked articles and videos:
        </Typography>
        <Button variant="outlined" onClick={handleSummarizeAll} disabled={summarizing || items.every(item => item.summary && item.summary.trim() !== '')} sx={{ mt: 2 }}>
          {summarizing ? 'Summarizing...' : 'Auto-Summarize All'}
        </Button>
      </Paper>
      {loading && <CircularProgress sx={{ mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
      <Grid container spacing={3} justifyContent="center">
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id || item.url}>
            <Card sx={{ minHeight: 180 }}>
              <CardContent>
                <Chip label={item.type === 'article' ? 'Article' : 'Video'} color={item.type === 'article' ? 'primary' : 'secondary'} sx={{ mb: 1 }} />
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                {item.url && <Typography variant="body2" sx={{ mb: 1 }}><a href={item.url} target="_blank" rel="noopener noreferrer">View Original</a></Typography>}
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