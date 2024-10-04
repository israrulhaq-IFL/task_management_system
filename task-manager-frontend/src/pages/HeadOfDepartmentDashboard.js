// src/pages/HeadOfDepartmentDashboard.js
import React from 'react';
import TaskList from '../components/TaskList';

const HeadOfDepartmentDashboard = ({ tasks, onDelete }) => {
  return (
    <div>
      <h2>Head of Department Dashboard</h2>
      <TaskList tasks={tasks} onDelete={onDelete} />
      {/* Add more components and logic specific to Head of Department */}
    </div>
  );
};

export default HeadOfDepartmentDashboard;