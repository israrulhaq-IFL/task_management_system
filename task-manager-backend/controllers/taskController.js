const Task = require('../models/taskModel');
const TaskAssignee = require('../models/taskAssignee');
const TaskSubDepartment = require('../models/taskSubDepartment');

exports.createTask = (req, res) => {
  const { title, description, priority, status, assigned_to, created_by, department_id, sub_department_ids } = req.body;

  console.log('Assigned to:', assigned_to); // Log the assigned_to array

  const taskData = {
    title,
    description,
    priority: priority || 'medium',
    status,
    created_by,
    department_id
  };

  Task.create(taskData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    // Remove the extra closing brace

    const taskId = result.taskId;

    const assigneePromises = assigned_to && assigned_to.length > 0
      ? assigned_to.map(user => new Promise((resolve, reject) => {
          const userId = user.user_id; // Correctly extract user_id
          console.log('User ID:', userId); // Log the userId
          TaskAssignee.create(taskId, userId, (err) => {
            if (err) {
              console.error(`Error inserting into task_assignees for userId ${userId}:`, err);
              return reject(err);
            // Remove the extra closing brace
            resolve();
          });
        }))
      : [];

    // Use a Set to ensure unique sub_department_ids
    const uniqueSubDepartmentIds = [...new Set(sub_department_ids)];

    const subDepartmentPromises = uniqueSubDepartmentIds.length > 0
      ? uniqueSubDepartmentIds.map(subDepartmentId => new Promise((resolve, reject) => {
          TaskSubDepartment.create(taskId, subDepartmentId, (err) => {
            if (err) {
              console.error(`Error inserting into task_sub_departments for subDepartmentId ${subDepartmentId}:`, err);
              return reject(err);
            }
            resolve();
          });
        }))
      : [];

    Promise.all([...assigneePromises, ...subDepartmentPromises])
      .then(() => {
        res.status(201).json({ id: taskId, ...taskData }); // Return the task ID
      })
      .catch(err => {
        res.status(500).json({ error: 'Error inserting into related tables', details: err.message });
      });
  });
};

exports.getTaskById = (req, res) => {
  const taskId = req.params.id;
  Task.getById(taskId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.getAllTasks = (req, res) => {
  Task.getAll((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.getTasksByDepartment = (req, res) => {
  const departmentId = req.params.departmentId;
  Task.getByDepartment(departmentId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.getTasksBySubDepartment = (req, res) => {
  const subDepartmentId = req.params.subDepartmentId;
  Task.getBySubDepartment(subDepartmentId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { title, description, priority, status, assigned_to, department_id, sub_department_ids } = req.body;

  const taskData = {
    title,
    description,
    priority,
    status,
    department_id
  };

  Task.update(taskId, taskData, assigned_to, sub_department_ids, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Task updated successfully' });
  });
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  Task.delete(taskId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
};

// Update task status
exports.updateTaskStatus = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'in progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  console.log(`Updating task ${taskId} to status ${status}`); // Log the task ID and new status

  // Update only the status field
  exports.updateTaskStatus = (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
  
    // Validate status
    const validStatuses = ['pending', 'in progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  
    console.log(`Updating task ${taskId} to status ${status}`); // Log the task ID and new status
  
    // Update only the status field
    Task.updateStatus(taskId, status, (err, result) => {
      if (err) {
        console.error('Error updating task status:', err); // Log the error
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task status updated successfully' });
    });
  };