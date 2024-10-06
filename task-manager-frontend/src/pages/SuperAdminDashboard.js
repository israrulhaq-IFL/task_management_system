import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import './SuperAdminDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    subDepartment: ''
  });
  
  const loggedInUserId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      setError('No token found');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('There was an error fetching the users!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user) => {
    setEditingUser(user.user_id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      subDepartment: user.subDepartment
    });
  };

  const handleDeleteClick = async (userId) => {
    console.log('Attempting to delete user with ID:', userId);
    console.log('Logged in user ID:', loggedInUserId);

    if (userId === parseInt(loggedInUserId, 10)) {
      setError('You cannot delete your own account.');
      console.error('Attempted to delete own account');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      setError('No token found');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user.user_id !== userId));
    } catch (error) {
      console.error('There was an error deleting the user!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      setError('No token found');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/${editingUser}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(user => (user.user_id === editingUser ? response.data : user)));
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: '',
        department: '',
        subDepartment: ''
      });
    } catch (error) {
      console.error('There was an error updating the user!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  return (
    <Container className="super-admin-dashboard">
      <h1 className="text-center my-4">Super Admin Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Sub-Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.department}</td>
              <td>{user.subDepartment}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(user)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteClick(user.user_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {editingUser && (
        <Form onSubmit={handleFormSubmit} className="mt-4">
          <h2>Edit User</h2>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control type="text" name="role" value={formData.role} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control type="text" name="department" value={formData.department} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group controlId="formSubDepartment">
            <Form.Label>Sub-Department</Form.Label>
            <Form.Control type="text" name="subDepartment" value={formData.subDepartment} onChange={handleInputChange} />
          </Form.Group>
          <Button variant="primary" type="submit" className="mr-2">Update User</Button>
          <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
        </Form>
      )}
    </Container>
  );
};

export default SuperAdminDashboard;