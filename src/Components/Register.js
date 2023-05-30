import React, { useState, useContext} from 'react';
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
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';


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

const generateIdentificationid = () => {
  const { v4: uuidv4 } = require('uuid');
  const Identificationid = uuidv4();
  return Identificationid;
};

export default function Register() {
  const [parentUsername, setParentUsername] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [childUsername, setChildUsername] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const Identificationid = generateIdentificationid();

    const parentData = {
      username: parentUsername,
      Identification: Identificationid,
      email: parentEmail,
      password: parentPassword,
      type: 'parent',
      tasks: [],
      shops: []
    };
  
    const childData = {
      username: childUsername,
      Identification: Identificationid,
      email: childEmail,
      password: childPassword,
      type: 'child',
      balance: 0
    };
  
    try {
      const parentResponse = await fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parentData),
      });
      const parentUserData = await parentResponse.json();
      console.log('Дані батьківського користувача успішно збережені:', parentUserData);
  
      const childResponse = await fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childData),
      });
      const childUserData = await childResponse.json();
      console.log('Дані дитини успішно збережені:', childUserData);
  
      navigate('/Shop');
    } catch (error) {
      console.error('Помилка при збереженні даних:', error);
    }
  };
  

  const saveUserData = (parentData, childData) => {
    saveParentData(parentData); 
    saveChildData(childData); 
  };

  const saveParentData = (parentData) => {
    fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parentData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Дані батьківського користувача успішно збережені:', data);
      })
      .catch((error) => {
        console.error('Помилка при збереженні даних батьківського користувача:', error);
      });
  };
  
  const saveChildData = (childData) => {
    fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(childData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Дані дитини успішно збережені:', data);
      })
      .catch((error) => {
        console.error('Помилка при збереженні даних дитини:', error);
      });
  };

  return (
    <div style={{
      backgroundImage: `url(${require('./image4.png')})`,
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
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} >
              {/* Перша форма реєстрації */}
              Info about Parent:
              <form noValidate >
            <TextField
              autoComplete="given-name"
              name="parentUsername"
              required
              fullWidth
              id="parentUsername"
              label="Parent Username"
              autoFocus
              value={parentUsername}
              onChange={(event) => setParentUsername(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              required
              fullWidth
              id="parentEmail"
              label="Parent Email Address"
              name="parentEmail"
              autoComplete="email"
              value={parentEmail}
              onChange={(event) => setParentEmail(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              required
              fullWidth
              name="parentPassword"
              label="Parent Password"
              type="password"
              id="parentPassword"
              autoComplete="new-password"
              value={parentPassword}
              onChange={(event) => setParentPassword(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
              </form>
            </Grid>
            <Grid item xs={6} >
              {/* Друга форма реєстрації */}
              Info about Child:
              <form noValidate >
              <TextField
              autoComplete="given-name"
              name="childUsername"
              required
              fullWidth
              id="childUsername"
              label="Child Username"
              autoFocus
              value={childUsername}
              onChange={(event) => setChildUsername(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              required
              fullWidth
              id="childEmail"
              label="Child Email Address"
              name="childEmail"
              autoComplete="email"
              value={childEmail}
              onChange={(event) => setChildEmail(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
            <TextField
              required
              fullWidth
              name="childPassword"
              label="Child Password"
              type="password"
              id="childPassword"
              autoComplete="new-password"
              value={childPassword}
              onChange={(event) => setChildPassword(event.target.value)}
              sx={{ mt: 1, width: '100%' }}
            />
              </form>
            </Grid>
          </Grid>
          <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="Login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box mt={5}>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Container>
  </ThemeProvider>
  </div>
  );
}