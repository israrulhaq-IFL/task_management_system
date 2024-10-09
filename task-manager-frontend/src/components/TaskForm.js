import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const TaskForm = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('medium');
    const [assignedTo, setAssignedTo] = useState([]);
    const [managers, setManagers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
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
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user_id}`, config);
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
        if (user && user.department_id) {
            const fetchUsers = async () => {
                try {
                    console.log('Fetching users for department:', user.department_id); // Debugging log
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users?department_id=${user.department_id}`, config);
                    console.log('Fetched users:', response.data); // Debugging log
                    setManagers(response.data.managers || []);
                    setTeamMembers(response.data.teamMembers || []);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            };

            fetchUsers();
        }
    }, [user]);

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
                    {managers.map(manager => (
                        <option key={manager.user_id} value={JSON.stringify(manager)}>{manager.name}</option>
                    ))}
                    {teamMembers.map(member => (
                        <option key={member.user_id} value={JSON.stringify(member)}>{member.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Task
            </Button>
        </Form>
    );
};

export default TaskForm;