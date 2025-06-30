import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Grid, Card, CardContent, Chip, Button, CircularProgress, Alert, Box, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function Profile({ username: propUsername }) {
  const params = useParams();
  const username = propUsername || params.username;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summarizing, setSummarizing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!username) {
      setError('No username specified.');
      setLoading(false);
      return;
    }
    fetchItems();
    fetchFollowStatus();
    fetchFollowCounts();
  }, [username]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:5000/user/${encodeURIComponent(username)}/items`);
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError('Could not load tracked items.');
    }
    setLoading(false);
  }

  const fetchFollowStatus = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/is_following/${encodeURIComponent(username)}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.following);
      }
    } catch (err) {
      console.error('Failed to fetch follow status:', err);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/followers/${encodeURIComponent(username)}`),
        fetch(`http://127.0.0.1:5000/following/${encodeURIComponent(username)}`)
      ]);
      
      if (followersRes.ok) {
        const followersData = await followersRes.json();
        setFollowers(followersData);
      }
      if (followingRes.ok) {
        const followingData = await followingRes.json();
        setFollowing(followingData);
      }
    } catch (err) {
      console.error('Failed to fetch follow counts:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/follow/${encodeURIComponent(username)}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setIsFollowing(true);
        fetchFollowCounts();
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/unfollow/${encodeURIComponent(username)}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setIsFollowing(false);
        fetchFollowCounts();
      }
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

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

  const isOwnProfile = propUsername === username;

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {isOwnProfile ? 'My Profile' : `${username}'s Profile`}
          </Typography>
          {!isOwnProfile && (
            <IconButton
              color={isFollowing ? 'error' : 'primary'}
              onClick={isFollowing ? handleUnfollow : handleFollow}
              size="large"
            >
              {isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
            </IconButton>
          )}
        </Box>
        
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {username ? `Tracked articles and videos for ${username}:` : 'No username specified.'}
        </Typography>

        {/* Follow Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{followers.length}</strong> followers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{following.length}</strong> following
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{items.length}</strong> items tracked
          </Typography>
        </Box>

        {isOwnProfile && (
          <Button variant="outlined" onClick={handleSummarizeAll} disabled={summarizing || items.every(item => item.summary && item.summary.trim() !== '')} sx={{ mt: 2 }}>
            {summarizing ? 'Summarizing...' : 'Auto-Summarize All'}
          </Button>
        )}
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

      {items.length === 0 && !loading && !error && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No items tracked yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isOwnProfile ? 'Install the browser extension to start tracking your reading and watching history!' : 'This user hasn\'t tracked any items yet.'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
} 