"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

export default function RegisterUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check if all fields are filled
  const isFormValid = username && email && password;

  const handleRegister = async () => {
    setLoading(true);
    setStatusMessage('');

    try {
      const response = await axios.post('/api/register', {
        username,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        setStatusMessage('User registered successfully!');
      } else {
        setStatusMessage('Failed to register user.');
      }
    } catch (error) {
    //   setStatusMessage('Error occurred: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
          Register New User
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>

        {/* Register Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          disabled={loading || !isFormValid} // Disable if loading or fields are incomplete
          sx={{
            backgroundColor: isFormValid ? '#3b82f6 !important' : 'gray',  // Change color based on form validity
            color: '#ffffff !important',            // Force the text color to white
            '&:hover': {
              backgroundColor: isFormValid ? '#1d4ed8 !important' : 'gray',  // Darker green on hover only if form is valid
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>

        {statusMessage && (
          <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
            {statusMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
