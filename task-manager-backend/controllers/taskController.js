const Task = require('../models/taskModel');

exports.createTask = (req, res) => {
  const task = req.body;
  Task.create(task, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, ...task });
  });
};

exports.getAllTasks = (req, res) => {
  Task.getAll((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const task = req.body;
  Task.update(id, task, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id, ...task });
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  Task.delete(id, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Task deleted successfully' });
  });
};