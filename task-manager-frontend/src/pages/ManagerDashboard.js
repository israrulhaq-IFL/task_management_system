// src/pages/ManagerDashboard.js
import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import { Button, Modal } from 'react-bootstrap';
import TaskForm from '../components/TaskForm';

const ManagerDashboard = ({ tasks, onDelete, updateStatus, addTask }) => {
  const [showForm, setShowForm] = useState(false);

  const handleStatusChange = (id, event) => {
    const newStatus = event.target.value;
    updateStatus(id, newStatus);
  };

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <div className="text-center mb-4">
        <Button variant="primary" onClick={() => setShowForm(true)}>Add Task</Button>
      </div>
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

export default ManagerDashboard;