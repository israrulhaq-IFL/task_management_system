import React from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    console.log(`Changing status of task ${task.task_id} to ${newStatus}`);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${task.task_id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });
      console.log('Status update response:', response.data);
      onStatusChange(task.task_id, newStatus);
    } catch (error) {
      console.error('There was an error updating the task status!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  // Ensure assignees and sub_departments are parsed into arrays if they are strings
  const assignees = task.assignees ? task.assignees.split(',') : [];
  const subDepartments = task.sub_departments ? task.sub_departments.split(',') : [];

  console.log('Rendering TaskCard with task:', task); // Log the task data

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{task.title || 'Untitled Task'}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {task.description}
        </Card.Text>
        <Card.Text>
          <strong>Created By:</strong> {task.created_by_name || 'N/A'}
        </Card.Text>
        <Card.Text>
          <strong>Assigned To:</strong> {assignees.length > 0 ? assignees.join(', ') : 'N/A'}
        </Card.Text>
        <Card.Text>
          <strong>Subdepartments:</strong> {subDepartments.length > 0 ? subDepartments.join(', ') : 'N/A'}
        </Card.Text>
        <Card.Text>
          <strong>Created At:</strong> {task.created_at ? new Date(task.created_at).toLocaleString() : 'N/A'}
        </Card.Text>
        <Card.Text>
          <strong>Status:</strong> {task.status}
        </Card.Text>
        <Button variant="danger" onClick={() => onDelete(task.task_id)}>Delete</Button>
        <Form.Control as="select" value={task.status} onChange={handleStatusChange} className="mt-2">
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </Form.Control>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;