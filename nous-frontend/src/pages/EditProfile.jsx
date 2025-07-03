import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [user, setUser] = useState({ username: '', email: '', bio: '', location: '', occupation: '' });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    };

    const fetchUser = async () => {
      const res = await fetch('http://localhost:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = e => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };


  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('bio', user.bio);
    formData.append('location', user.location || '');
    formData.append('occupation', user.occupation || '');
    if (user.profileImage) {
      formData.append('profileImage', user.profileImage);
    }
    const res = await fetch('http://localhost:8000/api/auth/update-profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

  if (res.ok) {
    navigate('/dashboard');
  } else {
    alert('Update failed');
  }
};

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <h2>Edit Profile</h2>

        <label>Username:</label>
        <input
          name="username"
          value={user.username}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Email:</label>
        <input
          name="email"
          value={user.email}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Bio:</label>
        <textarea
          name="bio"
          value={user.bio}
          onChange={handleChange}
          style={{ ...styles.input, height: '100px' }}
        />

        <label>Location:</label>
        <input
          name="location"
          value={user.location}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Occupation:</label>
        <input
          name="occupation"
          value={user.occupation}
          onChange={handleChange}
          style={styles.input}
        />

        <label>Profile Image:</label>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit" style={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  button: {
    padding: '0.75rem',
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default EditProfile;
