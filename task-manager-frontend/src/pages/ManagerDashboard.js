import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import { Button, Modal, Alert } from 'react-bootstrap';
import TaskForm from '../components/TaskForm';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Fetched tasks:', response.data); // Log the fetched tasks
        setTasks(response.data);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          setError(error.response.data.error);
        }
      }
    };

    fetchTasks();

    // Fetch role from local storage or API
    const userRole = localStorage.getItem('role'); // Assuming role is stored in local storage
    setRole(userRole);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(tasks.map(task => task.task_id === id ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error('There was an error updating the task status!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });
      setTasks(tasks.filter(task => task.task_id !== id));
    } catch (error) {
      console.error('There was an error deleting the task!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });
      setTasks([...tasks, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('There was an error adding the task!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <div className="text-center mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>Add Task</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <TaskList tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm addTask={addTask} role={role} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManagerDashboard;