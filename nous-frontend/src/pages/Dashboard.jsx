// Updated Dashboard.jsx with full feature list
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Invalid token');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost.trim(),
        timestamp: new Date().toLocaleString(),
        author: user.username
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (!user || !user.username) return (
    <div style={styles.loading}>Loading dashboard...</div>
  );

  return (
    <div style={{ ...styles.container, backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5', color: darkMode ? '#fff' : '#000' }}>
      <div style={styles.sidebar(darkMode)}>
          {user.profileImage ? (
            <img
              src={`http://localhost:8000${user.profileImage}`}
              alt="Profile"
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
            />
          ) : (
            <div style={styles.avatar}>
              {user.profileImage ? (
                <img
                  src={`http://localhost:8000/uploads/${user.profileImage}`}
                  alt="profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
          )}
          <h2>{user.username}</h2>
        <button onClick={toggleDarkMode} style={styles.toggle}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        <button onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }} style={styles.logout}>Log Out</button>
      </div>
      <div style={styles.main}>
        <h1>Welcome back, <span style={{ color: '#2563eb' }}>{user.username}</span></h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio || 'No bio added yet.'}</p>

        <div style={styles.actions}>
          <button style={styles.button} onClick={() => navigate('/edit-profile')} className="action-button">Refine Profile</button>
          <button style={styles.button} onClick={handlePost}>Refine Zeitgeist</button>
        </div>

        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Spread the Light of Consciousness..."
          style={styles.textarea(darkMode)}
        />

        <h3>Recent Activity</h3>
        {posts.length ? (
          <ul style={styles.feed}>
            {posts.map(post => (
              <li key={post.id} style={styles.postItem(darkMode)}>
                <p>{post.content}</p>
                <small>{post.timestamp}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts yet. Time to make your first move!</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'system-ui'
  },
  sidebar: (darkMode) => ({
    background: darkMode ? '#111' : '#e5e7eb',
    width: '260px',
    padding: '2rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }),
  avatar: {
    margin: '0 auto 1rem',
    width: '80px',
    height: '80px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    flex: 1,
    padding: '3rem',
    maxWidth: '700px'
  },
  toggle: {
    margin: '1rem auto',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#d1d5db',
    cursor: 'pointer'
  },
  logout: {
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: '0.5rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-end'
  },
  actions: {
    margin: '1.5rem 0',
    display: 'flex',
    gap: '1rem'
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  textarea: (darkMode) => ({
    width: '100%',
    height: '80px',
    padding: '1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    background: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#fff' : '#000'
  }),
  feed: {
    listStyle: 'none',
    padding: 0
  },

  profileImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '1rem'
  },

  postItem: (darkMode) => ({
    background: darkMode ? '#333' : '#f0f0f0',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  }),
  loading: {
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '3rem'
  }
};

export default Dashboard;
