import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';

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
  const [editMode, setEditMode] = useState(false); // State to track if we are in edit mode
  const [editSubDepartmentId, setEditSubDepartmentId] = useState(null); // State to store the ID of the sub-department being edited
  const token = localStorage.getItem('accessToken'); // Get the token from local storage

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
    fetchSubDepartments();
    fetchManagers();
    fetchDepartments();
  }, [fetchSubDepartments, fetchManagers, fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected manager is already assigned to a sub-department in a different department
    const isManagerAssignedToDifferentDepartment = subDepartments.some(subDept => 
      subDept.manager_id === formData.manager_id && subDept.department_id !== formData.department_id
    );
    if (isManagerAssignedToDifferentDepartment) {
      setError('The selected manager is already assigned to a sub-department in a different department.');
      return;
    }

    try {
      if (editMode) {
        // Update existing sub-department
        const response = await axios.put(`${API_BASE_URL}/api/sub-departments/${editSubDepartmentId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update the sub-departments state with the updated sub-department data
        setSubDepartments(subDepartments.map(subDept => (subDept.sub_department_id === editSubDepartmentId ? response.data : subDept)));
        setEditMode(false);
        setEditSubDepartmentId(null);
      } else {
        // Create new sub-department
        const response = await axios.post(`${API_BASE_URL}/api/sub-departments`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Check if the response contains the created sub-department data
        if (response.data.sub_department_id) {
          // Update the sub-departments state with the new sub-department data
          setSubDepartments([...subDepartments, response.data]);
        } else {
          // Manually update the sub-department data in the state
          const newSubDepartment = {
            sub_department_id: response.data.subDepartmentId,
            sub_department_name: formData.sub_department_name,
            manager_id: formData.manager_id,
            department_id: formData.department_id
          };
          setSubDepartments([...subDepartments, newSubDepartment]);
        }
      }

      setFormData({ sub_department_name: '', manager_id: '', department_id: '' });
    } catch (error) {
      console.error('There was an error creating/updating the sub-department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const handleEdit = (subDepartment) => {
    setFormData({
      sub_department_name: subDepartment.sub_department_name || '',
      manager_id: subDepartment.manager_id || '',
      department_id: subDepartment.department_id || ''
    });
    setEditMode(true);
    setEditSubDepartmentId(subDepartment.sub_department_id);
  };

  const handleDelete = async (subDepartmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/sub-departments/${subDepartmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubDepartments(subDepartments.filter(subDept => subDept.sub_department_id !== subDepartmentId));
    } catch (error) {
      console.error('There was an error deleting the sub-department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  // Filter out managers who are already assigned to sub-departments in different departments
  const availableManagers = managers.filter(manager => 
    !subDepartments.some(subDept => subDept.manager_id === manager.user_id && subDept.department_id !== formData.department_id)
  );

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
            {availableManagers.map(manager => (
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
        <Button variant="primary" type="submit">{editMode ? 'Update Sub-Department' : 'Create Sub-Department'}</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sub-Department Name</th>
            <th>Manager Name</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subDepartments.map(subDepartment => (
            <tr key={subDepartment.sub_department_id}>
              <td>{subDepartment.sub_department_id}</td>
              <td>{subDepartment.sub_department_name}</td>
              <td>{subDepartment.manager_name || 'Unknown'}</td>
              <td>{subDepartment.department_name || 'Unknown'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(subDepartment)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(subDepartment.sub_department_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SubDepartmentManagement;