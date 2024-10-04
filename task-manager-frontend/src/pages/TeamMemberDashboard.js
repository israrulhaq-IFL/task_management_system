// src/pages/TeamMemberDashboard.js
import React from 'react';
import TaskList from '../components/TaskList';

const TeamMemberDashboard = ({ tasks, onDelete }) => {
  return (
    <div>
      <h2>Team Member Dashboard</h2>
      <TaskList tasks={tasks} onDelete={onDelete} />
      {/* Add more components and logic specific to Team Member */}
    </div>
  );
};

export default TeamMemberDashboard;