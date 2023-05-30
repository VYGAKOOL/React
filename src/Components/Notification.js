import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

const Notification = () => {
    const [data, setData] = useState([]);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const authenticatedUserok = JSON.parse(localStorage.getItem('authenticatedUser'));
    const Idcode = authenticatedUserok.Identification;

    useEffect(() => {
        fetchData();
        const storedUser = localStorage.getItem('authenticatedUser');
        if (storedUser) {
          setAuthenticatedUser(JSON.parse(storedUser));
        }
    }, []);
  
    const fetchData = () => {
        fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users')
        .then(response => response.json())
        .then(data => {
          const user = data.find(user => user.Identification === Idcode && user.type === 'parent');
          if (user && user.shops) {
            setData(user.shops);
          } else {
            setData([]);
          }
        })
        .catch(error => console.error('Помилка при отриманні даних:', error));
    };

    const decreaseBoughtValue = (itemId) => {
      axios
        .get(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users?Identification=${Idcode}`)
        .then((response) => {
          const parentUser = response.data.find(
            (user) => user.type === 'parent' && user.Identification === Idcode);
            
            if (parentUser) {
              const updatedShops = parentUser.shops.map((item) => {
                if (item.id === itemId) {
                  return {
                    ...item,
                    bought: 0,
                  };
                }
                return item;
              });
      
              const updatedUser = {
                ...parentUser,
                shops: updatedShops,
              };
              axios
                .put(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/${parentUser.id}`, updatedUser)
                .then(() => {
                  console.log(`Значення "bought" для товару з id ${itemId} збільшено на 1`);
                })
                .catch((error) => {
                  console.error('Помилка при оновленні значення "bought":', error);
                });
            } else {
              console.error('Користувач з типом "parent" та заданим Identification не знайдений');
            }
          })
          .catch((error) => {
            console.error('Помилка при отриманні даних користувача:', error);
          });
      };
  
    const renderCards = () => {
      const filteredData = data.filter((item) => item.bought > 0);
      if (filteredData.length === 0) {
        return (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography variant="h5" color="text.secondary">
                Your child hasn't bought anything yet
              </Typography>
            </Box>
          </Grid>
        );
      }
      return filteredData.map((item) => (
        <Grid item key={item.id} xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia component="img" height="225" image={item.image} alt={item.title} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ mt: 'auto' }}>
            <Box sx={{ backgroundColor: 'red', color: 'white', p: 2 }}>
              <Typography variant="body2">Your child bought {item.bought} times this item</Typography>
            </Box>
            </CardActions>
            <Button size="small" onClick={() => decreaseBoughtValue(item.id)}>Delete data</Button>
          </Card>
        </Grid>
      ));
    };
  
    return (
      <div style={{
        backgroundImage: `url(${require('./image3.png')})`,
        backgroundSize: 'cover',
        minHeight: '100vh'}}>
      <ThemeProvider theme={createTheme()}>
        <main>
          <Box sx={{ bgcolor: 'background.paper', pt: 8}}>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={2}>
              {renderCards()}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
      </div>
    );
  }
export default Notification