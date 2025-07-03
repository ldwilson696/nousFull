import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setMessage('✅ Login successful!');
        // Navigate to profile/dashboard
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setMessage(`❌ ${data.message || 'Invalid login'}`);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Log In to Nous</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Log In</button>
        </form>
        <p style={styles.message}>{message}</p>
        <p style={styles.toggle}>
          Don’t have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f3f5',
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border 0.2s'
  },
  button: {
    padding: '0.8rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.3s'
  },
  message: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#444'
  },
  toggle: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

export default Login;