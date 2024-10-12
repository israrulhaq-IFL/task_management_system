import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container, Alert } from 'react-bootstrap';

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
  const [editMode, setEditMode] = useState(false); // State to track if we are in edit mode
  const [editDepartmentId, setEditDepartmentId] = useState(null); // State to store the ID of the department being edited
  const token = localStorage.getItem('accessToken'); // Get the token from local storage

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
    fetchDepartments();
    fetchHodUsers(); // Fetch HOD users when component mounts
  }, [fetchDepartments, fetchHodUsers]);

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

    // Check if the selected HOD is already assigned to another department
    const isHodAssigned = departments.some(dept => dept.hod_id === formData.hod_id && dept.department_id !== editDepartmentId);
    if (isHodAssigned) {
      setError('The selected HOD is already assigned to another department.');
      return;
    }

    try {
      if (editMode) {
        // Update existing department
        const response = await axios.put(`${API_BASE_URL}/api/departments/${editDepartmentId}`, formData, {
          headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
        });

        // Update the departments state with the updated department data
        setDepartments(departments.map(dept => (dept.department_id === editDepartmentId ? response.data : dept)));
        setEditMode(false);
        setEditDepartmentId(null);
      } else {
        // Create new department
        const response = await axios.post(`${API_BASE_URL}/api/departments`, formData, {
          headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
        });

        // Check if the response contains the created department data
        if (response.data.department_id) {
          // Update the departments state with the new department data
          setDepartments([...departments, response.data]);
        } else {
          // Manually update the department data in the state
          const newDepartment = {
            department_id: response.data.departmentId,
            department_name: formData.department_name,
            hod_id: formData.hod_id
          };
          setDepartments([...departments, newDepartment]);
        }
      }

      setFormData({ department_name: '', hod_id: '' });
    } catch (error) {
      console.error('There was an error creating/updating the department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const handleEdit = (department) => {
    setFormData({
      department_name: department.department_name,
      hod_id: department.hod_id
    });
    setEditMode(true);
    setEditDepartmentId(department.department_id);
  };

  const handleDelete = async (departmentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/departments/${departmentId}`, {
        headers: { Authorization: `Bearer ${token}` } // Include the token in the headers
      });
      setDepartments(departments.filter(dept => dept.department_id !== departmentId));
    } catch (error) {
      console.error('There was an error deleting the department!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  // Filter out HOD users who are already assigned to a department
  const availableHodUsers = hodUsers.filter(user => !departments.some(dept => dept.hod_id === user.user_id && dept.department_id !== editDepartmentId));

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
            {availableHodUsers.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">{editMode ? 'Update Department' : 'Create Department'}</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>HOD Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department.department_id}>
              <td>{department.department_id}</td>
              <td>{department.department_name}</td>
              <td>{userMap[department.hod_id] || 'Unknown'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(department)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(department.department_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default DepartmentManagement;