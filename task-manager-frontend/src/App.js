import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { Route, Routes, Navigate } from 'react-router-dom'; // Removed BrowserRouter and Router
import Layout from './components/Layout';
import HeadOfDepartmentDashboard from './pages/HeadOfDepartmentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamMemberDashboard from './pages/TeamMemberDashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm'; // Import RegisterForm
import { Container, Row, Col } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const fetchTasks = useCallback(() => {
    axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tasks!', error);
      });
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  const addTask = (task) => {
    axios.post(`${API_BASE_URL}/api/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTasks([...tasks, response.data]);
      })
      .catch(error => {
        console.error('There was an error adding the task!', error);
      });
  };

  const deleteTask = (id) => {
    axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the task!', error);
      });
  };

  const updateTaskStatus = (id, event) => {
    const status = event.target.value;
    axios.put(`${API_BASE_URL}/api/tasks/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? { ...task, status: response.data.status } : task));
      })
      .catch(error => {
        console.error('There was an error updating the task status!', error);
      });
  };

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleRegisterSuccess = (message) => {
    alert(message);
  };

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={10} lg={8}>
            {token ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Routes>
                  <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                  <Route path="/register" element={<RegisterForm onRegister={handleRegisterSuccess} />} />
                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
              </>
            )}
            <Routes>
              <Route path="/dashboard/head" element={token ? <HeadOfDepartmentDashboard tasks={tasks} onDelete={deleteTask} addTask={addTask} /> : <Navigate to="/" />} />
              <Route path="/dashboard/manager" element={token ? <ManagerDashboard tasks={tasks} onDelete={deleteTask} updateStatus={updateTaskStatus} addTask={addTask} /> : <Navigate to="/" />} />
              <Route path="/dashboard/team" element={token ? <TeamMemberDashboard tasks={tasks} onDelete={deleteTask} updateStatus={updateTaskStatus} /> : <Navigate to="/" />} />
              {/* Add more routes as needed */}
            </Routes>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;