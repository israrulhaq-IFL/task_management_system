import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const TaskList = ({ tasks, onDelete, onStatusChange }) => {
  const handleDelete = async (taskId) => {
    try {
      await onDelete(taskId);
    } catch (error) {
      console.error('There was an error deleting the task!', error);
    }
  };

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
          <tr key={task.id}> {/* Ensure a unique key prop */}
            <td>{task.id}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              <Form.Control as="select" value={task.status} onChange={(e) => onStatusChange(task.id, e)}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Control>
            </td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TaskList;