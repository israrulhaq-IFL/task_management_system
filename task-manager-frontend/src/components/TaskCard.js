import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Button, Form, Dropdown, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Trash, EyeSlash } from 'react-bootstrap-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskCard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const TaskCard = ({ task, onDelete, onStatusChange, isExpanded, onExpand, onHide }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusDotColor, setStatusDotColor] = useState('');
  const [targetDate, setTargetDate] = useState(new Date(task.target_date));
  const cardRef = useRef(null);
  const datePickerWrapperRef = useRef(null); // Add a ref for the date picker wrapper

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
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${task.task_id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      onStatusChange(task.task_id, newStatus);
    } catch (error) {
      console.error('There was an error updating the task status!', error);
    }
  };

  const handleTargetDateChange = async (date) => {
    setTargetDate(date);
    try {
      await axios.put(`${API_BASE_URL}/api/tasks/${task.task_id}/target-date`, { target_date: date.toISOString().split('T')[0] }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
    } catch (error) {
      console.error('There was an error updating the task target date!', error);
    }
  };

  const assignees = task.assignees ? task.assignees.split(',') : [];
  const subDepartments = task.sub_departments ? task.sub_departments.split(',') : [];

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    onDelete(task.task_id);
    setShowModal(false);
  };

  const handleHide = () => {
    onHide(task.task_id);
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest('.task-card-dropdown') ||
      e.target.closest('.task-card-status-dropdown') ||
      (datePickerWrapperRef.current && datePickerWrapperRef.current.contains(e.target))
    ) {
      return;
    }
    onExpand();
  };

  return (
    <Card className={`mb-3 task-card ${isExpanded ? 'expanded' : ''}`} onClick={handleCardClick} ref={cardRef}>
      <div className={`status-dot ${statusDotColor}`}></div>
      {!isExpanded && (
        <OverlayTrigger placement="top" overlay={<Tooltip>Hide Task</Tooltip>}>
          <Button variant="link" className="task-card-hide-button-top-right" onClick={handleHide}>
            <EyeSlash />
          </Button>
        </OverlayTrigger>
      )}
      <Card.Body>
        <Card.Text>
          <strong></strong> {new Date(task.created_at).toLocaleString()}
        </Card.Text>
        <Card.Title className="task-card-title">{task.title || 'Untitled Task'}</Card.Title>
        <Card.Text className="task-card-description" dangerouslySetInnerHTML={{ __html: task.description }}></Card.Text>
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
            <Card.Text>
              <strong>Target Date:</strong>
              <div ref={datePickerWrapperRef}>
                <DatePicker selected={targetDate} onChange={handleTargetDateChange} />
              </div>
            </Card.Text>
            <Dropdown onToggle={() => setShowMenu(!showMenu)} show={showMenu} className="task-card-dropdown">
              <Dropdown.Toggle variant="link" id="dropdown-basic" className="task-card-dropdown-toggle">
                {/* Dropdown Toggle Content */}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDelete} className="task-card-delete-button">
                  <Trash /> Delete
                </Dropdown.Item>
                <Dropdown.Item onClick={handleHide} className="task-card-hide-button">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Hide Task</Tooltip>}>
                    <EyeSlash />
                  </OverlayTrigger>
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