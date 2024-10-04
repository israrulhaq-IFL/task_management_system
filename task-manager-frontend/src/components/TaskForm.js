import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const TaskForm = ({ addTask }) => {
    

    const [title, setTitle] = useState(''); // State for the title input field
    const [description, setDescription] = useState(''); // State for the description input field
    const [status, setStatus] = useState('pending'); // State for the status input field

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({ title, description, status }); // Call the addTask function with the title, description, and status values
        setTitle(''); // Reset the title field to an empty string
        setDescription(''); // Reset the description field to an empty string
        setStatus('pending'); // Reset the status field to 'pending'
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
                <Form.Label>Title:</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} // Update the title state when the input value changes
                />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} // Update the description state when the input value changes
                />
            </Form.Group>
            <Form.Group controlId="formStatus">
                <Form.Label>Status:</Form.Label>
                <Form.Control
                    as="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)} // Update the status state when the input value changes
                >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="approved">Approved</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Task
            </Button>
        </Form>
    );
};

export default TaskForm;
