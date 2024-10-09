import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const TaskList = ({ tasks, onDelete, onStatusChange }) => {
  const handleDelete = async (taskId) => {
    try {
      await onDelete(taskId);
    } catch (error) {
      console.error('There was an error deleting the task!', error);
    }
  };

  const handleStatusChange = async (taskId, event) => {
    const newStatus = event.target.value;
    try {
      console.log(`Sending request to update task ${taskId} to status ${newStatus}`); // Log the task ID and new status
      await axios.put(`http://localhost:3001/api/tasks/${taskId}/status`, { status: newStatus });
      onStatusChange(taskId, newStatus);
    } catch (error) {
      console.error('There was an error updating the task status!', error);
    }
  };

  console.log('tasks:', tasks);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.task_id}>
            <td>{task.task_id}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              <Form.Control as="select" value={task.status} onChange={(e) => handleStatusChange(task.task_id, e)}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Control>
            </td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(task.task_id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TaskList;