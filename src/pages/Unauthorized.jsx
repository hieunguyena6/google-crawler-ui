import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from 'react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios'

export default function SignInUp() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const { mutate, isLoading } = useMutation(({ email, password }) => {
    return axios.post(`${process.env.REACT_APP_SERVICE_URL}/v1/${isSignIn ? 'login' : 'signup'}`,
      { email, password })
  }, {
    onSuccess: (data) => {
      enqueueSnackbar('Successfully', {
        variant: 'success',
        autoHideDuration: 5000,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top'
        }
      });
      if (!isSignIn) {
        setEmail('');
        setPassword('');
        setIsSignIn(true);
      } else {
        localStorage.setItem('token', data.data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.data.user));
        window.location.reload();
      }
    },
    onError: (err) => {
      enqueueSnackbar(err.response.data.message, {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top'
        }
      });
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password || password.length < 6) {
      enqueueSnackbar('Please fill email, password and password at least 6 charactors', {
        variant: 'error',
        autoHideDuration: 5000,
        anchorOrigin: {
          horizontal: 'center',
          vertical: 'top'
        }
      });
      return;
    }
    mutate({
      email,
      password
    })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {
            isSignIn ? 'Sign In' : 'Sign up'
          }
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {
              isSignIn ? 'Sign In' : 'Sign up'
            }
          </Button>
          <Grid container>
            <Grid item>
              <Link variant="body2" onClick={() => setIsSignIn(!isSignIn)}>
                {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}