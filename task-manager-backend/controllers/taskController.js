const Task = require('../models/taskModel');

exports.createTask = (req, res) => {
  const taskData = req.body;
  Task.create(taskData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, ...taskData }); // Return the task ID
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
  const taskData = req.body;
  Task.update(taskId, taskData, (err, result) => {
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