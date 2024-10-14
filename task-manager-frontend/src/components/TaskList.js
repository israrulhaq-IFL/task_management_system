import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import { Badge } from 'react-bootstrap';
import './TaskList.css'; // Import the CSS file

const TaskList = ({ tasks, onDelete, onStatusChange }) => {
  const [taskList, setTaskList] = useState(tasks);
  const [expandedPendingTaskId, setExpandedPendingTaskId] = useState(null);
  const [expandedInProgressTaskId, setExpandedInProgressTaskId] = useState(null);
  const [expandedCompletedTaskId, setExpandedCompletedTaskId] = useState(null);

  useEffect(() => {
    console.log('TaskList received tasks:', tasks); // Log the received tasks
    setTaskList(tasks);
  }, [tasks]);

  const handleStatusChange = (taskId, newStatus) => {
    setTaskList(taskList.map(task => task.task_id === taskId ? { ...task, status: newStatus } : task));
    onStatusChange(taskId, newStatus);
  };

  const handleExpand = (taskId, status) => {
    if (status === 'pending') {
      setExpandedPendingTaskId(expandedPendingTaskId === taskId ? null : taskId);
    } else if (status === 'in progress') {
      setExpandedInProgressTaskId(expandedInProgressTaskId === taskId ? null : taskId);
    } else if (status === 'completed') {
      setExpandedCompletedTaskId(expandedCompletedTaskId === taskId ? null : taskId);
    }
  };

  const pendingTasks = taskList.filter(task => task.status === 'pending');
  const inProgressTasks = taskList.filter(task => task.status === 'in progress');
  const completedTasks = taskList.filter(task => task.status === 'completed');

  return (
    <div className="task-list-container">
      <div className="task-column">
        <div className="task-column-header">
          <h3>Pending</h3>
          <Badge pill className="task-count primary shadow-sm">{pendingTasks.length}</Badge>
        </div>
        {pendingTasks.map(task => (
          <TaskCard
            key={task.task_id}
            task={task}
            onDelete={onDelete}
            onStatusChange={handleStatusChange}
            isExpanded={expandedPendingTaskId === task.task_id}
            onExpand={() => handleExpand(task.task_id, 'pending')}
          />
        ))}
      </div>

      <div className="task-column">
        <div className="task-column-header">
          <h3>In Progress</h3>
          <Badge pill className="task-count warning shadow-sm">{inProgressTasks.length}</Badge>
        </div>
        {inProgressTasks.map(task => (
          <TaskCard
            key={task.task_id}
            task={task}
            onDelete={onDelete}
            onStatusChange={handleStatusChange}
            isExpanded={expandedInProgressTaskId === task.task_id}
            onExpand={() => handleExpand(task.task_id, 'in progress')}
          />
        ))}
      </div>

      <div className="task-column">
        <div className="task-column-header">
          <h3>Completed</h3>
          <Badge pill className="task-count success shadow-sm">{completedTasks.length}</Badge>
        </div>
        {completedTasks.map(task => (
          <TaskCard
            key={task.task_id}
            task={task}
            onDelete={onDelete}
            onStatusChange={handleStatusChange}
            isExpanded={expandedCompletedTaskId === task.task_id}
            onExpand={() => handleExpand(task.task_id, 'completed')}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;