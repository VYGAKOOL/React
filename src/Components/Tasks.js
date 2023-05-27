import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const [editTask, setEditTask] = useState(null);

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const authenticatedUser = JSON.parse(localStorage.getItem('authenticatedUser'));
  const Idcode = authenticatedUser.Identification;

  const fetchData = () => {
    fetch('https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users')
      .then(response => response.json())
      .then(data => {
        const userTasks = data.filter(user => user.type === 'parent' && user.Identification === Idcode)
          .flatMap(user => user.tasks || []);
        setTasks(userTasks);
      })
      .catch(error => console.error('Помилка при отриманні даних:', error));
  };

  const handleToggle = (taskId) => () => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          checked: !task.checked, 
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };
  console.log('Idcode', Idcode);
  
  const handleSaveTask = () => {
    if (authenticatedUser.type === 'parent') {
      if (!editTask.description || !editTask.reward) {
        console.error('Немає достатньої інформації про завдання');
        return;
      }
  
      axios
        .get(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users?Identification=${Idcode}`)
        .then(response => {
          const parentUser = response.data.find(user => user.type === 'parent' && user.Identification === Idcode);
          if (parentUser) {
            const updatedTasks = parentUser.tasks.map(task => {
              if (task.id === editTask.id) {
                return {
                  ...task,
                  description: editTask.description,
                  reward: editTask.reward,
                };
              }
              return task;
            });
  
            axios
              .put(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/${parentUser.id}`, {
                tasks: updatedTasks,
              })
              .then(() => {
                setEditTask(null);
                fetchData();
              })
              .catch(error => {
                console.error('Помилка при оновленні завдання:', error);
              });
          } else {
            console.error('Користувач parent не знайдений');
          }
        })
        .catch(error => {
          console.error('Помилка при отриманні даних користувача:', error);
        });
    } else {
      console.error('Недостатньо прав для оновлення завдання');
    }
  };

  const handleDeleteTask = (taskId) => {
    axios
      .get(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users?Identification=${Idcode}`)
      .then(response => {
        const parentUser = response.data.find(user => user.type === 'parent' && user.Identification === Idcode);
        if (parentUser) {
          const updatedTasks = parentUser.tasks.filter(task => task.id !== taskId);
  
          axios
            .put(`https://646a874d7d3c1cae4ce2a2cd.mockapi.io/Users/${parentUser.id}`, {
              tasks: updatedTasks,
            })
            .then(() => {
              fetchData();
            })
            .catch(error => {
              console.error('Помилка при видаленні завдання:', error);
            });
        } else {
          console.error('Користувач parent не знайдений');
        }
      })
      .catch(error => {
        console.error('Помилка при отриманні даних користувача:', error);
      });
  };
  

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper', margin:'10px auto', mt:10 }}> 
      {tasks.map((task) => {
        const labelId = `checkbox-list-label-${task.id}`;
        return (
          <ListItem
            key={task.id}
            secondaryAction={
              <>
              <IconButton edge="end" aria-label="comments" onClick={() => handleEditTask(task)}>
                <ModeIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
              </>
            }
            disablePadding
          > 
            <ListItemButton role={undefined} onClick={handleToggle(task.id)} dense>
              <ListItemIcon>
                <Typography
                  component="span"
                  sx={{
                    width: '24px',
                    height: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    color: task.checked ? '#00FF00' : '#FF0000',
                  }}
                >
                  {task.checked ? <CheckIcon /> : <ClearIcon />}
                </Typography>
              </ListItemIcon>
              <ListItemText id={labelId} primary={task.description} secondary={`Reward: ${task.reward}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

<Dialog open={Boolean(editTask)} onClose={() => setEditTask(null)}>
<DialogTitle>Edit Task</DialogTitle>
<DialogContent>
  <TextField
    label="Description"
    value={editTask?.description || ''}
    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
    fullWidth
    margin="normal"
  />
  <TextField
    label="Reward"
    value={editTask?.reward || ''}
    onChange={(e) => setEditTask({ ...editTask, reward: e.target.value })}
    fullWidth
    margin="normal"
  />
</DialogContent>
<DialogActions>
  <Button onClick={() => setEditTask(null)}>Cancel</Button>
  <Button onClick={handleSaveTask}>Save</Button>
</DialogActions>
</Dialog>
</>

  );
}
