import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import HeadOfDepartmentDashboard from './pages/HeadOfDepartmentDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import TeamMemberDashboard from './pages/TeamMemberDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { Container, Row, Col } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState({ role: '', department: '', subDepartment: '' });
  const navigate = useNavigate();

  const fetchUserInfo = useCallback(() => {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    axios.get(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const userData = response.data; // User data is directly available
        console.log('User data:', userData); // Log the user data
        setUser(userData);
      })
      .catch(error => {
        console.error('There was an error fetching the user info!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      });
  }, [token]);

  const fetchUsers = useCallback(() => {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    axios.get(`${API_BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Users data:', response.data); // Log the users data
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      });
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserInfo();
      fetchUsers(); // Fetch users when the token is available
    }
  }, [token, fetchUserInfo, fetchUsers]);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    if (!token) {
      console.error('No token found for logout');
      return;
    }

    console.log('Logging out with token:', token); // Log the token

    axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setToken('');
        localStorage.removeItem('token');
        setUser({ role: '', department: '', subDepartment: '' });
        console.log('Logged out successfully');
        navigate('/login'); // Redirect to login page after logout
      })
      .catch(error => {
        console.error('There was an error logging out!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      });
  };

  const handleRegisterSuccess = (message) => {
    alert(message);
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'Team Member':
        return <TeamMemberDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'HOD':
        return <HeadOfDepartmentDashboard />;
      case 'Super Admin':
        return <SuperAdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={10} lg={8}>
            {token ? (
              <>
                <button onClick={handleLogout}>Logout</button>
                {user.role === 'Super Admin' ? (
                  renderDashboard()
                ) : (
                  user.department && user.subDepartment ? (
                    renderDashboard()
                  ) : (
                    <div>
                      <p>Please wait until your management assigns you a team.</p>
                    </div>
                  )
                )}
              </>
            ) : (
              <Routes>
                <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterForm onRegister={handleRegisterSuccess} />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;