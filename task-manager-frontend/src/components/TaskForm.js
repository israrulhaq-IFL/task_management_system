import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const TaskForm = ({ addTask, role }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('medium');
    const [assignedTo, setAssignedTo] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        const token = localStorage.getItem('token');
        if (user_id && token) {
            const fetchUserDetails = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const response = await axios.get(`${API_BASE_URL}/api/users/${user_id}`, config);
                    const userDetails = response.data;
                    console.log('Fetched user details:', userDetails); // Debugging log
                    setUser(userDetails);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };

            fetchUserDetails();
        }
    }, []);

    useEffect(() => {
        if (user) {
            const fetchUsers = async () => {
                try {
                    const token = localStorage.getItem('token');
                    console.log('Token:', token); // Debugging log
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                             'Cache-Control': 'no-cache'
                        }
                    };
                    let response;
                    console.log('Role:', role); // Debugging log
                    if (role === 'Manager') {
                        response = await axios.get(`${API_BASE_URL}/api/users/manager?manager_id=${user.user_id}`, config);
                    } else if (role === 'team-member') {
                        response = await axios.get(`${API_BASE_URL}/api/users/team-member?department_id=${user.department_id}`, config);
                    } else if (role === 'hod') {
                        response = await axios.get(`${API_BASE_URL}/api/users/hod`, config);
                    }
                    console.log('Fetched users response:', response); // Debugging log
                    console.log('Response data:', response.data); // Detailed log
                    if (response && response.data && response.data.users) {
                        const userIds = response.data.users.map(user => user.user_id);
                        console.log('User IDs:', userIds); // Debugging log
                        setUsers(userIds);
                    } else {
                        console.error('Unexpected response structure:', response);
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };
    
            fetchUsers();
        }
    }, [user, role]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const created_by = user.user_id;
        const department_id = user.department_id;
        const sub_department_ids = assignedTo.map(assignee => assignee.sub_department_id);

        addTask({ title, description, priority, status, assigned_to: assignedTo, created_by, department_id, sub_department_ids });
        setTitle('');
        setDescription('');
        setStatus('pending');
        setPriority('medium');
        setAssignedTo([]);
    };

    const handleAssigneeChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => JSON.parse(option.value));
        setAssignedTo(selectedOptions);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
                <Form.Label>Title:</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="formStatus">
                <Form.Label>Status:</Form.Label>
                <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPriority">
                <Form.Label>Priority:</Form.Label>
                <Form.Control
                    as="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAssignees">
                <Form.Label>Assign To:</Form.Label>
                <Form.Control
                    as="select"
                    multiple
                    onChange={handleAssigneeChange}
                >
                    <option key={user.user_id} value={JSON.stringify(user)}>{user.name} (You)</option>
                    {users.map(user => (
                        <option key={user.user_id} value={JSON.stringify(user)}>{user.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Task
            </Button>
        </Form>
    );
};

TaskForm.propTypes = {
    addTask: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired
};

export default TaskForm;