import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Form, Dropdown, Modal } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Import the icons
import './TaskCard.css'; // Import the CSS file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const TaskCard = ({ task, onDelete, onStatusChange, isExpanded, onExpand }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusDotColor, setStatusDotColor] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    updateStatusDotColor(task.status);
  }, [task.status]);

  useEffect(() => {
    if (isExpanded) {
      cardRef.current.style.maxHeight = `${cardRef.current.scrollHeight}px`;
    } else {
      cardRef.current.style.maxHeight = '200px';
    }
  }, [isExpanded]);

  const updateStatusDotColor = (status) => {
    if (status === 'pending') {
      setStatusDotColor('blue');
    } else if (status === 'in progress') {
      setStatusDotColor('orange');
    } else if (status === 'completed') {
      setStatusDotColor('green');
      setTimeout(() => {
        setStatusDotColor('dim');
      }, 5000);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    console.log(`Changing status of task ${task.task_id} to ${newStatus}`);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${task.task_id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accesstoken')}` }
      });
      console.log('Status update response:', response.data);
      onStatusChange(task.task_id, newStatus);
    } catch (error) {
      console.error('There was an error updating the task status!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  // Ensure assignees and sub_departments are parsed into arrays if they are strings
  const assignees = task.assignees ? task.assignees.split(',') : [];
  const subDepartments = task.sub_departments ? task.sub_departments.split(',') : [];

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    onDelete(task.task_id);
    setShowModal(false);
  };

  const handleCardClick = (e) => {
    // Prevent the card from contracting when clicking on the dropdown menu or status dropdown
    if (e.target.closest('.task-card-dropdown') || e.target.closest('.task-card-status-dropdown')) {
      return;
    }
    onExpand();
  };

  return (
    <Card className={`mb-3 task-card ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick} ref={cardRef}>
      <div className={`status-dot ${statusDotColor}`}></div>
      <Card.Body>
        <Card.Text>
          <strong></strong> {new Date(task.created_at).toLocaleString()}
        </Card.Text>
        <Card.Title className="task-card-title">{task.title || 'Untitled Task'}</Card.Title>
        <Card.Text className="task-card-description">{task.description}</Card.Text>
        <Card.Text className="task-card-created-by">
          <strong>By:</strong> {task.created_by_name}
        </Card.Text>
        {isExpanded && (
          <>
            <Card.Text>
              <strong>To:</strong> {assignees.join(', ') || 'N/A'}
            </Card.Text>
            <Card.Text>
              <strong>Subdept:</strong> {subDepartments.join(', ') || 'N/A'}
            </Card.Text>
            <Card.Text>
              <strong>Status:</strong> {task.status}
            </Card.Text>
            <Dropdown onToggle={() => setShowMenu(!showMenu)} show={showMenu} className="task-card-dropdown">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className="task-card-dropdown-toggle">
            
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDelete} className="task-card-delete-button">
                  <Trash /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control as="select" value={task.status} onChange={handleStatusChange} className="mt-2 task-card-status-dropdown">
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Control>
          </>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? If you delete the task, the assignees will be notified, and the task will be removed from all users.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default TaskCard;