import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useState, useEffect } from 'react';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

function App() {
  const title = 'Reactivities';
  // hooks - REACT Functionaliity to fetch data from the backend and manage state

  // useState hook to manage activities state
  // const [activities, setActivities] = useState<Activity[]>([]); // Assuming Activity is a defined type
  // For now, we can use a simple array of objects to represent activities
  // const [activities, setActivities] = useState<{ id: number; name: string }[]>([]);
  // For demonstration purposes, we can initialize it with an empty array
  const [activities, setActivities] = useState<Activities[]>([]);

  // useEffect hook to fetch activities from the backend API when the component mounts
  useEffect(() => {
    // Fetch activities from the backend API when the component mounts
   axios.get<Activities[]>('https://localhost:5001/api/activities') // Replace with your actual API endpoint
      .then(response => setActivities(response.data)) 
      .catch(error => console.error('Error fetching activities:', error));

  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Typography variant="h3">{title}</Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id}>
            <ListItemText>{activity.title}</ListItemText>
          </ListItem>
        ))}
      </List>  
    </>
  );
}

export default App
