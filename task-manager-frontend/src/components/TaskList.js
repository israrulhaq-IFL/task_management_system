import React, { useEffect, useState, useCallback } from 'react';
import TaskCard from './TaskCard';
import { DndProvider } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import { Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Eye, Funnel } from 'react-bootstrap-icons';
import './TaskList.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const ItemTypes = {
  TASK: 'task',
};

const TaskList = ({ tasks, onDelete, onStatusChange, user, canDragAndDrop }) => {
  const [taskList, setTaskList] = useState([]);
  const [hiddenPendingTasks, setHiddenPendingTasks] = useState([]);
  const [hiddenInProgressTasks, setHiddenInProgressTasks] = useState([]);
  const [hiddenCompletedTasks, setHiddenCompletedTasks] = useState([]);
  const [expandedPendingTaskId, setExpandedPendingTaskId] = useState(null);
  const [expandedInProgressTaskId, setExpandedInProgressTaskId] = useState(null);
  const [expandedCompletedTaskId, setExpandedCompletedTaskId] = useState(null);
  const [filterAssignedByMe, setFilterAssignedByMe] = useState(false); // Filter state

  useEffect(() => {
    console.log('TaskList received tasks:', tasks); // Log the received tasks
    // Sort tasks by created_at date in descending order
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setTaskList(sortedTasks);
  }, [tasks]);

  const handleStatusChange = useCallback((taskId, newStatus) => {
    setTaskList(taskList => taskList.map(task => task.task_id === taskId ? { ...task, status: newStatus, hasInteracted: true } : task));
    onStatusChange(taskId, newStatus);
  }, [onStatusChange]);

  const handleExpand = useCallback((taskId, status) => {
    if (status === 'pending') {
      setExpandedPendingTaskId(expandedPendingTaskId === taskId ? null : taskId);
    } else if (status === 'in progress') {
      setExpandedInProgressTaskId(expandedInProgressTaskId === taskId ? null : taskId);
    } else if (status === 'completed') {
      setExpandedCompletedTaskId(expandedCompletedTaskId === taskId ? null : taskId);
    }
    setTaskList(taskList => taskList.map(task => task.task_id === taskId ? { ...task, hasInteracted: true } : task));
  }, [expandedPendingTaskId, expandedInProgressTaskId, expandedCompletedTaskId]);

  const moveTask = useCallback((taskId, newStatus) => {
    handleStatusChange(taskId, newStatus);
    logInteraction(taskId, 'status_change', newStatus);
  }, [handleStatusChange]);

  const handleHideTask = useCallback((taskId, status) => {
    if (status === 'pending') {
      setHiddenPendingTasks(hiddenPendingTasks => [...hiddenPendingTasks, taskId]);
    } else if (status === 'in progress') {
      setHiddenInProgressTasks(hiddenInProgressTasks => [...hiddenInProgressTasks, taskId]);
    } else if (status === 'completed') {
      setHiddenCompletedTasks(hiddenCompletedTasks => [...hiddenCompletedTasks, taskId]);
    }
  }, []);

  const handleUnhideAllTasks = useCallback((status) => {
    if (status === 'pending') {
      setHiddenPendingTasks([]);
    } else if (status === 'in progress') {
      setHiddenInProgressTasks([]);
    } else if (status === 'completed') {
      setHiddenCompletedTasks([]);
    }
  }, []);

  const logInteraction = async (taskId, interactionType, interactionDetail) => {
    try {
      await axios.post(`${API_BASE_URL}/api/tasks/interactions`, {
        taskId,
        interactionType,
        interactionDetail
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  const Task = ({ task, index, status }) => {
    const [, ref] = useDrag({
      type: ItemTypes.TASK,
      item: { taskId: task.task_id, status },
      canDrag: canDragAndDrop, // Disable drag if canDragAndDrop is false
    });

    return (
      <div ref={canDragAndDrop ? ref : null}>
        <TaskCard
          task={task}
          onDelete={onDelete}
          onStatusChange={handleStatusChange}
          isExpanded={status === 'pending' ? expandedPendingTaskId === task.task_id : status === 'in progress' ? expandedInProgressTaskId === task.task_id : expandedCompletedTaskId === task.task_id}
          onExpand={() => handleExpand(task.task_id, status)}
          onHide={(taskId) => handleHideTask(taskId, status)}
          user={user} // Pass the user prop to TaskCard
        />
      </div>
    );
  };

  const Column = ({ status, children }) => {
    const [, ref] = useDrop({
      accept: ItemTypes.TASK,
      drop: (item) => moveTask(item.taskId, status),
    });

    const hiddenTasks = status === 'pending' ? hiddenPendingTasks : status === 'in progress' ? hiddenInProgressTasks : status === 'completed' ? hiddenCompletedTasks : [];

    return (
      <div ref={ref} className="task-column">
        <div className="task-column-header">
          <h3>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
          <Badge pill className={`task-count ${status.replace(' ', '-')} shadow-sm`}>{children.length}</Badge>
          <OverlayTrigger placement="top" overlay={<Tooltip>Unhide All</Tooltip>}>
            <Button variant="link" onClick={() => handleUnhideAllTasks(status)} disabled={hiddenTasks.length === 0}>
              <Eye />
            </Button>
          </OverlayTrigger>
        </div>
        {children}
      </div>
    );
  };

  const filteredTasks = filterAssignedByMe
    ? taskList.filter(task => task.created_by === user.user_id)
    : taskList;

  const pendingTasks = filteredTasks.filter(task => task.status === 'pending' && !hiddenPendingTasks.includes(task.task_id));
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in progress' && !hiddenInProgressTasks.includes(task.task_id));
  const completedTasks = filteredTasks.filter(task => task.status === 'completed' && !hiddenCompletedTasks.includes(task.task_id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="task-list-container">
        <div className="task-list-header">
          <OverlayTrigger placement="top" overlay={<Tooltip>Filter Assigned by Me</Tooltip>}>
            <Button variant="link" onClick={() => setFilterAssignedByMe(!filterAssignedByMe)}>
              <Funnel />
            </Button>
          </OverlayTrigger>
        </div>
        <Column status="pending">
          {pendingTasks.map((task, index) => (
            <Task key={task.task_id} task={task} index={index} status="pending" />
          ))}
        </Column>
        <Column status="in progress">
          {inProgressTasks.map((task, index) => (
            <Task key={task.task_id} task={task} index={index} status="in progress" />
          ))}
        </Column>
        <Column status="completed">
          {completedTasks.map((task, index) => (
            <Task key={task.task_id} task={task} index={index} status="completed" />
          ))}
        </Column>
      </div>
    </DndProvider>
  );
};

export default TaskList;