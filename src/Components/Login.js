import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext, AuthProvider } from './AuthContext';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const theme = createTheme();

export default function Login() {
  const { login, authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users')
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((user) => user.username === username && user.password === password);
        if (user) {
        login(user.type === "parent");
        setAuthenticatedUser(user);
        localStorage.setItem('authenticatedUser', JSON.stringify(user));
        navigate('/Tasks');
      } else {
        setIsInvalidCredentials(true);
      }
    })
      .catch((error) => console.error('Помилка при отриманні даних:', error));
  };
  
  return (
    <div style={{
      backgroundImage: `url(${require('./image7.png')})`,
      backgroundSize: 'cover',
      minHeight: '100vh',}}>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Username"
              label="Username"
              name="Username"
              autoComplete="Username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
                {isInvalidCredentials && (
        <Typography variant="body2" color="error" align="center">
          Incorrect username or password
        </Typography>
      )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="Register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </div>
  );
}