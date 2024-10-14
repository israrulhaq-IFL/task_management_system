import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import './TaskList.css'; // Import the CSS file

const TaskList = ({ tasks, onDelete, onStatusChange }) => {
  const [taskList, setTaskList] = useState(tasks);

  useEffect(() => {
    console.log('TaskList received tasks:', tasks); // Log the received tasks
    setTaskList(tasks);
  }, [tasks]);

  const handleStatusChange = (taskId, newStatus) => {
    setTaskList(taskList.map(task => task.task_id === taskId ? { ...task, status: newStatus } : task));
    onStatusChange(taskId, newStatus);
  };

  const pendingTasks = taskList.filter(task => task.status === 'pending');
  const inProgressTasks = taskList.filter(task => task.status === 'in progress');
  const completedTasks = taskList.filter(task => task.status === 'completed');

  return (
    <div className="task-list-container">
      <div className="task-column">
        <h3>Pending Tasks</h3>
        {pendingTasks.map(task => (
          <TaskCard key={task.task_id} task={task} onDelete={onDelete} onStatusChange={handleStatusChange} />
        ))}
      </div>

      <div className="task-column">
        <h3>In Progress Tasks</h3>
        {inProgressTasks.map(task => (
          <TaskCard key={task.task_id} task={task} onDelete={onDelete} onStatusChange={handleStatusChange} />
        ))}
      </div>

      <div className="task-column">
        <h3>Completed Tasks</h3>
        {completedTasks.map(task => (
          <TaskCard key={task.task_id} task={task} onDelete={onDelete} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;