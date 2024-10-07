import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [hodUsers, setHodUsers] = useState([]); // State to store HOD users
  const [userMap, setUserMap] = useState({}); // State to store user ID to name mapping
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    department_name: '',
    hod_id: ''
  });
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
  const token = localStorage.getItem('token'); // Get the token from local storage

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('There was an error fetching the departments!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  const fetchHodUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users?role=HOD`, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
      });
      setHodUsers(response.data);

      // Create a mapping of user IDs to user names
      const userMap = response.data.reduce((map, user) => {
        map[user.user_id] = user.name;
        return map;
      }, {});
      setUserMap(userMap);
    } catch (error) {
      console.error('There was an error fetching the HOD users!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  useEffect(() => {
    console.log('Navigated to Department Management'); // Debugging log
    if (role !== 'Super Admin') {
      navigate('/'); // Redirect to home page if not Super Admin
    } else {
      fetchDepartments();
      fetchHodUsers(); // Fetch HOD users when component mounts
    }
  }, [role, navigate, fetchDepartments, fetchHodUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleHodChange = (e) => {
    const selectedUserId = e.target.value;
    setFormData({ ...formData, hod_id: selectedUserId });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData); // Debugging log
    try {
      const response = await axios.post(`${API_BASE_URL}/api/departments`, formData, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
      });
      setDepartments([...departments, response.data]);
      setFormData({ department_name: '', hod_id: '' });
    } catch (error) {
      console.error('There was an error creating the department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  return (
    <Container className="department-management">
      <h1 className="text-center my-4">Department Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleFormSubmit} className="mb-4">
        <Form.Group controlId="formDepartmentName">
          <Form.Label>Department Name</Form.Label>
          <Form.Control type="text" name="department_name" value={formData.department_name} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="formHodId">
          <Form.Label>HOD</Form.Label>
          <Form.Control as="select" name="hod_id" value={formData.hod_id} onChange={handleHodChange}>
            <option value="">Select HOD</option>
            {hodUsers.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Create Department</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>HOD Name</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department.department_id}>
              <td>{department.department_id}</td>
              <td>{department.department_name}</td>
              <td>{userMap[department.hod_id] || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DepartmentManagement;