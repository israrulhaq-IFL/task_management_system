import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HeadOfDepartmentDashboard from './pages/HeadOfDepartmentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamMemberDashboard from './pages/TeamMemberDashboard';
import { Container, Row, Col } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Ensure a default value is set

function App() {
  const [tasks, setTasks] = useState([]);

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

  const updateTaskStatus = (id, status) => {
    axios.put(`${API_BASE_URL}/api/tasks/${id}`, { status })
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? { ...task, status: response.data.status } : task));
      })
      .catch(error => {
        console.error('There was an error updating the task status!', error);
      });
  };

  return (
    <Router>
      <Layout>
        <Container>
          <Row className="justify-content-center mt-5">
            <Col xs={12} md={10} lg={8}>
              <div className="text-center mb-4">
                <h1>Task Management Application</h1>
              </div>
              <Routes>
                <Route path="/dashboard/head" element={<HeadOfDepartmentDashboard tasks={tasks} onDelete={deleteTask} addTask={addTask} />} />
                <Route path="/dashboard/manager" element={<ManagerDashboard tasks={tasks} onDelete={deleteTask} updateStatus={updateTaskStatus} addTask={addTask} />} />
                <Route path="/dashboard/team" element={<TeamMemberDashboard tasks={tasks} onDelete={deleteTask} updateStatus={updateTaskStatus} />} />
                {/* Add more routes as needed */}
              </Routes>
            </Col>
          </Row>
        </Container>
      </Layout>
    </Router>
  );
}

export default App;