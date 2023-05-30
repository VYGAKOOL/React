import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Snackbar
} from '@mui/material';
import axios from 'axios';

const ShopModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isFieldsEmpty, setIsFieldsEmpty] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isShopCreated, setIsShopCreated] = useState(false);
  const [users, setUsers] = useState([]);
  const [ShopId, setShopId] = useState('');
  const [ShopDescription, setShopDescription] = useState('');
  const [ShopTitle, setShopTitle] = useState('');
  const [ShopPrice, setShopPrice] = useState('');
  const [ShopImage, setShopImage] = useState('');

  
  const handleSaveShop = () => {
    if ( !ShopDescription || !ShopTitle || !ShopPrice || !ShopImage ) {
      setIsFieldsEmpty(true);
      return;
    }
  
    const ShopData = {
      id: generateUniqueId(),
      description: ShopDescription,
      title: ShopTitle,
      price: Number(ShopPrice),
      bought: 0,
      image : ShopImage
    };
  
    
    const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
    const parentUsername = authenticatedUser.username;
  
    axios
      .get(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users?username=${parentUsername}`)
      .then(response => {
        const parentUser = response.data.find(user => user.type === 'parent' && user.username === parentUsername);
  
        if (parentUser) {
          const updatedShops = [...parentUser.shops, ShopData];
  
          axios
            .put(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/${parentUser.id}`, { shops: updatedShops })
            .then(() => {
              const updatedUsers = users.map(user => {
                if (user.id === parentUser.id) {
                  return { ...user, shops: updatedShops };
                }
                return user;
              });
  
              setUsers(updatedUsers);
              setIsShopCreated(true);
              setShopId(generateUniqueId);
              setShopTitle('');
              setShopDescription('');
              setShopPrice('');
              setShopImage('');
            })
            .catch(error => {
              console.error('Error updating shops:', error);
              throw new Error('Failed to update shops');
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
  const handleShopModalClose = () => {
    setIsShopModalOpen(false);
  };


  return (
    <>
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={ShopTitle}
              onChange={(e) => setShopTitle(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={ShopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Price"
              value={ShopPrice}
              onChange={(e) => setShopPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              label="Image Link"
              value={ShopImage}
              onChange={(e) => setShopImage(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSaveShop}>Save</Button>
      </DialogActions>
    </Dialog>
    <Snackbar
        open={isFieldsEmpty}
        autoHideDuration={3000}
        onClose={() => setIsFieldsEmpty(false)}
        message="Please fill in all fields."
      />

      <Snackbar
        open={isShopCreated}
        autoHideDuration={3000}
        onClose={handleShopModalClose}
        message="Task successfully created."
      />
    </>
  );
};

export default ShopModal;
