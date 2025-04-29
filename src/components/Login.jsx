import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ rollNumber: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Register or login (POST /create-user)
      await axios.post('https://dynamic-form-generator-9rl7.onrender.com/create-user', formData);
      // Fetch form (GET /get-form)
      const response = await axios.get(
        `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${formData.rollNumber}`
      );
      if (response.data && response.data.form) {
        localStorage.setItem('rollNumber', formData.rollNumber);
        localStorage.setItem('name', formData.name);
        navigate('/form');
      } else {
        setError('Form not found for this roll number.');
      }
    } catch (err) {
      // If user already exists, still try to fetch the form
      if (err.response?.data?.message?.toLowerCase().includes('already exists')) {
        try {
          const response = await axios.get(
            `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${formData.rollNumber}`
          );
          if (response.data && response.data.form) {
            localStorage.setItem('rollNumber', formData.rollNumber);
            localStorage.setItem('name', formData.name);
            navigate('/form');
            return;
          } else {
            setError('Form not found for this roll number.');
            return;
          }
        } catch (fetchErr) {
          setError(fetchErr.response?.data?.message || 'Login failed');
          return;
        }
      }
      setError(err.response?.data?.message || 'Login/Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Student Login / Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login / Register'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 
