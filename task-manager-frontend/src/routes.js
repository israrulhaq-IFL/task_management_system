import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

const AppRoutes = ({ tasks, addTask }) => (
  <Router>
    <Routes>
      <Route exact path="/" element={<TaskList tasks={tasks} />} />
      <Route path="/add-task" element={<TaskForm addTask={addTask} />} />
      {/* Add more routes as needed */}
    </Routes>
  </Router>
);

export default AppRoutes;