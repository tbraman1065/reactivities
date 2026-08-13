import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import axios from 'axios';
import Navbar from './navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';


function App() {
  //const title = 'Reactivities';
  // hooks - REACT Functionaliity to fetch data from the backend and manage state

  // useState hook to manage activities state
  // const [activities, setActivities] = useState<Activity[]>([]); // Assuming Activity is a defined type
  // For now, we can use a simple array of objects to represent activities
  // const [activities, setActivities] = useState<{ id: number; name: string }[]>([]);
  // For demonstration purposes, we can initialize it with an empty array
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  // useEffect hook to fetch activities from the backend API when the component mounts
  useEffect(() => {
    // Fetch activities from the backend API when the component mounts
   axios.get<Activity[]>('https://localhost:5001/api/activities') // Replace with your actual API endpoint
      .then(response => setActivities(response.data)) 
      .catch(error => console.error('Error fetching activities:', error));

  }, []); // Empty dependency array means this effect runs once on mount

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(a => a.id === id));
  };

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

   const handleOpenForm = (id?: string) => {
    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);
  }
   const handleFormClose = () => {
    setEditMode(false);
   }

   const handleSubmitForm = (activity: Activity) => {
    if (activity.id) {
      // Update existing activity
      setActivities(activities.map(a => a.id === activity.id ? activity : a));
    } else {
      // Create new activity
      //activity.id = Math.random().toString(36).substr(2, 9); // Generate a random ID for demonstration
      const newActivity = { ...activity, id: (activities.length + 1).toString() }; // Assign a new ID based on the length of the activities array
      setSelectedActivity(newActivity);
      setActivities([...activities, newActivity]);
    }

    setEditMode(false);
    
   }

   const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
   }  

  return (
    <Box sx={{bgcolor: '#eeeeee'}}>
      <CssBaseline />
      <Navbar openForm={handleOpenForm} />
      <Container maxWidth= 'xl' sx={{mt: 3}}>
        <ActivityDashboard 
          activities={activities} 
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleFormClose}
          submitForm={handleSubmitForm}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </Box>
  );
}

export default App
