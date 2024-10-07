import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const SubDepartmentManagement = () => {
  const [subDepartments, setSubDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sub_department_name: '',
    manager_id: '',
    department_id: ''
  });
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
  const token = localStorage.getItem('token'); // Get the token from local storage

  const fetchSubDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sub-departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubDepartments(response.data);
    } catch (error) {
      console.error('There was an error fetching the sub-departments!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  const fetchManagers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users?role=Manager`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('There was an error fetching the managers!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  }, [token]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${token}` }
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

  useEffect(() => {
    if (role !== 'Super Admin') {
      navigate('/'); // Redirect to home page if not Super Admin
    } else {
      fetchSubDepartments();
      fetchManagers();
      fetchDepartments();
    }
  }, [role, navigate, fetchSubDepartments, fetchManagers, fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/sub-departments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubDepartments([...subDepartments, response.data]);
      setFormData({ sub_department_name: '', manager_id: '', department_id: '' });
    } catch (error) {
      console.error('There was an error creating the sub-department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  return (
    <Container className="sub-department-management">
      <h1 className="text-center my-4">Sub-Department Management</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleFormSubmit} className="mb-4">
        <Form.Group controlId="formSubDepartmentName">
          <Form.Label>Sub-Department Name</Form.Label>
          <Form.Control type="text" name="sub_department_name" value={formData.sub_department_name} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group controlId="formManagerId">
          <Form.Label>Manager</Form.Label>
          <Form.Control as="select" name="manager_id" value={formData.manager_id} onChange={handleInputChange}>
            <option value="">Select Manager</option>
            {managers.map(manager => (
              <option key={manager.user_id} value={manager.user_id}>{manager.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formDepartmentId">
          <Form.Label>Department</Form.Label>
          <Form.Control as="select" name="department_id" value={formData.department_id} onChange={handleInputChange}>
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Create Sub-Department</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sub-Department Name</th>
            <th>Manager Name</th>
            <th>Department Name</th>
          </tr>
        </thead>
        <tbody>
          {subDepartments.map(subDepartment => (
            <tr key={subDepartment.sub_department_id}>
              <td>{subDepartment.sub_department_id}</td>
              <td>{subDepartment.sub_department_name}</td>
              <td>{subDepartment.manager_name || 'Unknown'}</td>
              <td>{subDepartment.department_name || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SubDepartmentManagement;