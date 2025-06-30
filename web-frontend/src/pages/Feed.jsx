import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Chip, Button, CircularProgress, Alert, Box, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function Feed({ username }) {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!username) {
      setError('Please log in to view your feed');
      setLoading(false);
      return;
    }
    
    // Check if session is valid
    const checkSession = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/session', { credentials: 'include' });
        const data = await res.json();
        console.log('Session check:', data);
        if (!data.logged_in) {
          setError('Session expired. Please log in again.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    
    checkSession();
    fetchFeed();
    fetchFollowing();
  }, [username]);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:5000/feed', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch feed');
      const data = await res.json();
      setFeedItems(data);
    } catch (err) {
      setError('Could not load feed.');
    }
    setLoading(false);
  };

  const fetchFollowing = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/following/${encodeURIComponent(username)}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.map(u => u.username));
      }
    } catch (err) {
      console.error('Failed to fetch following:', err);
    }
  };

  const searchUsers = async () => {
    if (!searchUsername.trim()) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/user/${encodeURIComponent(searchUsername)}/items`, { credentials: 'include' });
      if (res.ok) {
        const items = await res.json();
        if (items.length > 0) {
          setSearchResults([{ username: searchUsername, items }]);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    }
  };

  const handleFollow = async (targetUsername) => {
    console.log('Attempting to follow:', targetUsername);
    try {
      const res = await fetch(`http://127.0.0.1:5000/follow/${encodeURIComponent(targetUsername)}`, {
        method: 'POST',
        credentials: 'include'
      });
      console.log('Follow response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Follow response data:', data);
        setFollowing([...following, targetUsername]);
        fetchFeed(); // Refresh feed
        console.log('Successfully followed:', targetUsername);
      } else {
        const errorData = await res.json();
        console.error('Follow failed:', errorData);
      }
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };

  const handleUnfollow = async (targetUsername) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/unfollow/${encodeURIComponent(targetUsername)}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        setFollowing(following.filter(u => u !== targetUsername));
        fetchFeed(); // Refresh feed
      }
    } catch (err) {
      console.error('Failed to unfollow user:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Debug info */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Current user: {username || 'Not logged in'}
      </Alert>
      
      <Grid container spacing={3}>
        {/* Feed Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Your Feed
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Content from people you follow
            </Typography>
          </Paper>

          {loading && <CircularProgress sx={{ mt: 4 }} />}
          {error && <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            {feedItems.map(item => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip 
                        label={item.type === 'article' ? 'Article' : 'Video'} 
                        color={item.type === 'article' ? 'primary' : 'secondary'} 
                        size="small" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        by {item.username}
                      </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    {item.url && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">View Original</a>
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {item.summary && item.summary.trim() !== '' ? item.summary : <i>Summary coming soon...</i>}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {feedItems.length === 0 && !loading && !error && (
            <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No content in your feed yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Follow some users to see their reading and watch lists here!
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Sidebar - Discover Users */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Discover Users
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" onClick={searchUsers} fullWidth>
                Search
              </Button>
            </Box>

            {searchResults.map(result => (
              <Card key={result.username} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{result.username}</Typography>
                    {following.includes(result.username) ? (
                      <IconButton 
                        color="error" 
                        onClick={() => handleUnfollow(result.username)}
                        size="small"
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    ) : (
                      <IconButton 
                        color="primary" 
                        onClick={() => handleFollow(result.username)}
                        size="small"
                      >
                        <PersonAddIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {result.items.length} items tracked
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Following ({following.length})
            </Typography>
            <List dense>
              {following.map(username => (
                <ListItem key={username}>
                  <ListItemText primary={username} />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="error" 
                      onClick={() => handleUnfollow(username)}
                      size="small"
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            {following.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Not following anyone yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 