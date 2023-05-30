import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Snackbar
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import ShopModal from './ShopModal';
import { balanceSubject, BalanceObserver } from './balanceObserver.js';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const storedIsAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [taskChecked, setTaskChecked] = useState('');
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [shops, setShops] = useState([]);

  const isTaskPage = location.pathname === '/Tasks';
  const isShopPage = location.pathname === '/Shop';

  const handleShopModalOpen = () => {
    setIsShopModalOpen(true);
  };

  const handleShopModalClose = () => {
    setIsShopModalOpen(false);
  };

  const handleSaveShopItem = (shopData) => {
    console.log('Shop item data:', shopData);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsTaskCreated(false);
    setIsFieldsEmpty(false);
    setTaskId('');
    setTaskDescription('');
    setTaskReward('');
    setTaskChecked('');
  };

const handleSaveTask = () => {
  if ( !taskDescription || !taskReward ) {
    setIsFieldsEmpty(true);
    return;
  }

  const taskData = {
    id: generateUniqueId(),
    description: taskDescription,
    reward: Number(taskReward),
    checked: taskChecked === 'true'
  };

  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  const parentUsername = authenticatedUser.username;
  console.log('parentUsername:', parentUsername);

  axios
    .get(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users?username=${parentUsername}`)
    .then(response => {
      const parentUser = response.data.find(user => user.type === 'parent' && user.username === parentUsername);
      console.log('parentUser:', parentUser);

      if (parentUser) {
        const updatedTasks = [...parentUser.tasks, taskData];

        axios
          .put(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/${parentUser.id}`, { tasks: updatedTasks })
          .then(() => {
            const updatedUsers = users.map(user => {
              if (user.id === parentUser.id) {
                return { ...user, tasks: updatedTasks };
              }
              return user;
            });

            setUsers(updatedUsers);
            setIsTaskCreated(true);
            setTaskId(generateUniqueId);
            setTaskDescription('');
            setTaskReward('');
            setTaskChecked("false");
          })
          .catch(error => {
            console.error('Error updating tasks:', error);
            throw new Error('Failed to update tasks');
          });
      } else {
        throw new Error('Parent user not found');
      }
    })
    .catch(error => {
      console.error('Error fetching parent user:', error);
      throw new Error('Failed to fetch parent user');
    });
};

const generateUniqueId = () => {
  const { v4: uuidv4 } = require('uuid');
  const UniqueId = uuidv4();
  return UniqueId;
};

  const inputProps = {
    margin: 'dense',
    fullWidth: true,
  };

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem('isAdmin')) || false);

  useEffect(() => {
    setIsAdmin(storedIsAdmin);
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    if (authenticatedUser) {
      setAuthenticatedUser(authenticatedUser);
    axios
    .get('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users')
    .then(response => {
      const userData = response.data;
      const user = userData.find(user => user.username === authenticatedUser.username);
      if (user) {
        
        setBalance(user.balance);
      }
    })
    .catch(error => {
      console.error('Error fetching balance:', error);
    });
  }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', JSON.stringify(false));
    setIsAdmin(false);
    localStorage.setItem('isAdmin', JSON.stringify(false));
    setAuthenticatedUser(null);
    localStorage.removeItem('authenticatedUser');
    navigate('/login');
  };

  const Balance = () => {
    const balanceObserver = new BalanceObserver();
    useEffect(() => {
      balanceSubject.addObserver(balanceObserver);
      
      return () => {
        balanceSubject.removeObserver(balanceObserver);
      };
    }, []);
  };

  return (
    <>
      <Outlet />
      <AppBar>
        <Container fixed >
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-laabel="menu">
            </IconButton>
            <Typography variant="h4" mr={3}>FamiHelp |</Typography>
            <Button color='inherit' variant='primary' href="Tasks">Tasks</Button>
            <Box mr={40}>
              <Button color='inherit' variant='primary' href="Shop">Shop</Button>
            </Box>
            { storedIsAdmin && (
              <Box mr={4}>
                <Button color='secondary' variant='contained' href='Notification'>
                    Notification
                </Button>
              </Box>
            )}
            {isTaskPage && storedIsAdmin && (
              <Box mr={4}>
                <Button color='secondary' variant='contained' onClick={handleModalOpen}>
                  <AddCircleIcon /> Task Button
                </Button>
              </Box>
            )}      
            {isShopPage && storedIsAdmin && (
              <Box mr={4}>
                <Button color='secondary' variant='contained' onClick={handleShopModalOpen}>
                  <AddCircleIcon /> Shop Button
                </Button>
              </Box>
            )}
            <ShopModal isOpen={isShopModalOpen} onClose={handleShopModalClose} onSave={handleSaveShopItem} />

            {isAuthenticated ? (
              <Box display="flex" alignItems="center" justifyContent="flex-end" >
                <Button color='error' variant='contained' onClick={logout} >Log Out</Button>
                {isAdmin ? null : <Typography variant="subtitle1" ml={5} sx={{ display: 'flex', alignItems: 'center' }}>
                    Your Balance: {balance}
                    <MonetizationOnIcon sx={{ fontSize: 25, verticalAlign: 'center', ml: 0.5 }} /></Typography>}
              </Box>
            ) : (
            <>
            <Box mr={5}>
              <Button color='success' variant='contained' href="Login">Log In</Button>
            </Box>
            <Button color='error' variant='contained' href="Register">Sign up</Button>
            </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
                
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent sx={{ display: 'flex' }}>
          <Grid direction="column" sx={{width:800}}>
            <Grid item xs={6}>
              <TextField
                label="Description"
                inputProps={inputProps}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                sx={{m: 2, width:'90%'}}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Reward"
                inputProps={inputProps}
                value={taskReward}
                onChange={(e) => setTaskReward(e.target.value)}
                sx={{m: 2, width:'22%'}}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSaveTask}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isFieldsEmpty}
        autoHideDuration={3000}
        onClose={() => setIsFieldsEmpty(false)}
        message="Please fill in all fields."
      />

      <Snackbar
        open={isTaskCreated}
        autoHideDuration={3000}
        onClose={handleModalClose}
        message="Task successfully created."
      />
    </>
  );
};

export { Layout };