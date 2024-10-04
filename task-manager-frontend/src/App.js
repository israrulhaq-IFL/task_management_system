import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Container, Row, Col, Button } from 'react-bootstrap';



const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('API_BASE_URL:', API_BASE_URL); // Debugging

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(`${API_BASE_URL}/api/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tasks!', error);
      });
  };

  const addTask = (task) => {
    axios.post(`${API_BASE_URL}/api/tasks`, task)
      .then(response => {
        setTasks([...tasks, response.data]);
        setShowForm(false); // Hide the form after adding a task
      })
      .catch(error => {
        console.error('There was an error adding the task!', error);
      });
  };


  const deleteTask = (id) => {
    axios.delete(`${API_BASE_URL}/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the task!', error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center">
            <h1>Task Management Application</h1>
          </div>
          <div className="text-center mt-3">
            {showForm ? (
              <TaskForm addTask={addTask} />
            ) : (
              <Button variant="primary" onClick={() => setShowForm(true)}>Add Task</Button>
            )}
          </div>
          <TaskList tasks={tasks} onDelete={deleteTask} />
        </Col>
      </Row>
    </Container>
  );
}



export default App;