// src/pages/ManagerDashboard.js
import React from 'react';
import TaskList from '../components/TaskList';

const ManagerDashboard = ({ tasks, onDelete }) => {
  return (
    <div>
      <h2>Manager Dashboard</h2>
      <TaskList tasks={tasks} onDelete={onDelete} />
      {/* Add more components and logic specific to Manager */}
    </div>
  );
};

export default ManagerDashboard;