import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer

import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

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
    <div className="App">
      <Header /> {/* Add Header */}
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={10} lg={8}>
            <div className="text-center mb-4">
              <h1>Task Management Application</h1>
            </div>
            <div className="text-center mb-4">
              <Button variant="primary" onClick={() => setShowForm(true)}>Add Task</Button>
            </div>
            <TaskList tasks={tasks} onDelete={deleteTask} />
          </Col>
        </Row>
      </Container>
      <Footer /> {/* Add Footer */}

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm addTask={addTask} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;