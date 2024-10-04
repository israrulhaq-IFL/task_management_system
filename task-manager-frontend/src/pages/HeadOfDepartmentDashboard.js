// src/pages/HeadOfDepartmentDashboard.js
import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import { Button, Modal, Alert } from 'react-bootstrap';
import TaskForm from '../components/TaskForm';

const HeadOfDepartmentDashboard = ({ tasks, onDelete, addTask }) => {
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleStatusChange = () => {
    setShowError(true);
  };

  return (
    <div>
      <h2>Head of Department Dashboard</h2>
      <div className="text-center mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>Add Task</Button>
      </div>
      {showError && <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
        You do not have permission to change the status of tasks.
      </Alert>}
      <TaskList tasks={tasks} onDelete={onDelete} onStatusChange={handleStatusChange} />
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm addTask={addTask} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HeadOfDepartmentDashboard;