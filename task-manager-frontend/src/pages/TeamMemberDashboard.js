// src/pages/TeamMemberDashboard.js
import React from 'react';
import TaskList from '../components/TaskList';

const TeamMemberDashboard = ({ tasks, onDelete, updateStatus }) => {
  const handleStatusChange = (id, event) => {
    const newStatus = event.target.value;
    updateStatus(id, newStatus);
  };

  return (
    <div>
      <h2>Team Member Dashboard</h2>
      <TaskList tasks={tasks} onDelete={onDelete} onStatusChange={handleStatusChange} />
    </div>
  );
};

export default TeamMemberDashboard;