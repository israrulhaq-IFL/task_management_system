import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import { Alert, Tabs, Tab } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const TeamMemberDashboard = ({ user }) => {
  const [tasksAssignedToOthers, setTasksAssignedToOthers] = useState([]);
  const [tasksAssignedToMe, setTasksAssignedToMe] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tasks/team-member`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const tasks = response.data;
        const tasksAssignedToMe = tasks.filter(task => task.assignees.includes(user.name));
        const tasksAssignedToOthers = tasks.filter(task => !task.assignees.includes(user.name));
        setTasksAssignedToMe(tasksAssignedToMe);
        setTasksAssignedToOthers(tasksAssignedToOthers);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          setError(error.response.data.error);
        }
      }
    };

    if (user.user_id) {
      fetchTasks();
    }
  }, [user.user_id, user.name]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setTasksAssignedToMe(tasksAssignedToMe.map(task => task.task_id === id ? { ...task, status: newStatus } : task));
      setTasksAssignedToOthers(tasksAssignedToOthers.map(task => task.task_id === id ? { ...task, status: newStatus } : task));
    } catch (error) {
      console.error('There was an error updating the task status!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setTasksAssignedToMe(tasksAssignedToMe.filter(task => task.task_id !== id));
      setTasksAssignedToOthers(tasksAssignedToOthers.filter(task => task.task_id !== id));
    } catch (error) {
      console.error('There was an error deleting the task!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div>
      <h2>Team Member Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Tabs defaultActiveKey="my-tasks" id="task-tabs">
        <Tab eventKey="my-tasks" title="My Tasks">
          <TaskList tasks={tasksAssignedToMe} onDelete={handleDelete} onStatusChange={handleStatusChange} user={user} canDragAndDrop={true} />
        </Tab>
        <Tab eventKey="other-tasks" title="Other Tasks in my dept">
          <TaskList tasks={tasksAssignedToOthers} onDelete={handleDelete} onStatusChange={handleStatusChange} user={user} canDragAndDrop={false} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default TeamMemberDashboard;