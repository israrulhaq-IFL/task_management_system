import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import withRole from '../hoc/withRole'; // Import the withRole HOC
import './UserManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Define roles statically
const roles = ['HOD', 'Manager', 'Team Member', 'Super Admin'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subDepartments, setSubDepartments] = useState([]); // State to store sub-departments
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department_id: '',
    sub_department_id: ''
  });

  const loggedInUserId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
  const token = localStorage.getItem('token'); // Get the token from local storage

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

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      }); // Include the token in the headers
      console.log('Fetched departments:', response.data); // Debugging log
      setDepartments(response.data);
    } catch (error) {
      console.error('There was an error fetching the departments!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  const fetchSubDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sub-departments`, {
        headers: { Authorization: `Bearer ${token}` }
      }); // Include the token in the headers
      console.log('Fetched sub-departments:', response.data); // Debugging log
      setSubDepartments(response.data);
    } catch (error) {
      console.error('There was an error fetching the sub-departments!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchSubDepartments(); // Fetch sub-departments
  }, [fetchUsers, fetchDepartments, fetchSubDepartments, token]);

  const handleEditClick = (user) => {
    setEditingUser(user.user_id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      sub_department_id: user.sub_department_id
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
        department_id: '',
        sub_department_id: ''
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
    <Container className="user-management">
      <h1 className="text-center my-4">User Management</h1>
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
              <td>{departments.find(dept => dept.department_id === user.department_id)?.department_name || 'Unknown'}</td>
              <td>{subDepartments.find(subDept => subDept.sub_department_id === user.sub_department_id)?.sub_department_name || 'Unknown'}</td>
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
            <Form.Control as="select" name="role" value={formData.role} onChange={handleInputChange}>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control as="select" name="department_id" value={formData.department_id} onChange={handleInputChange}>
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formSubDepartment">
            <Form.Label>Sub-Department</Form.Label>
            <Form.Control as="select" name="sub_department_id" value={formData.sub_department_id} onChange={handleInputChange}>
              <option value="">Select Sub-Department</option>
              {subDepartments.map(subDepartment => (
                <option key={subDepartment.sub_department_id} value={subDepartment.sub_department_id}>{subDepartment.sub_department_name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" className="mr-2">Update User</Button>
          <Button variant="secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
        </Form>
      )}
    </Container>
  );
};

export default withRole(UserManagement, ['Super Admin']); // Wrap the component with withRole HOC