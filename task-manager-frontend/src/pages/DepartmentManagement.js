import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    department_name: '',
    hod_id: ''
  });
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage

  useEffect(() => {
    console.log('Navigated to Department Management'); // Debugging log
    if (role !== 'Super Admin') {
      navigate('/'); // Redirect to home page if not Super Admin
    } else {
      fetchDepartments();
    }
  }, [role, navigate]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('There was an error fetching the departments!', error);
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
    console.log('Form data being submitted:', formData); // Debugging log
    try {
      const response = await axios.post(`${API_BASE_URL}/api/departments`, formData);
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
          <Form.Label>HOD ID</Form.Label>
          <Form.Control type="text" name="hod_id" value={formData.hod_id} onChange={handleInputChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Create Department</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>HOD ID</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department.department_id}>
              <td>{department.department_id}</td>
              <td>{department.department_name}</td>
              <td>{department.hod_id}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DepartmentManagement;