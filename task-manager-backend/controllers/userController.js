const User = require('../models/userModel');

exports.createUser = (req, res) => {
  const userData = req.body;
  User.create(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  });
};

exports.getUserById = (req, res) => {
  const userId = req.params.id;
  User.getById(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.getAllUsers = (req, res) => {
  User.getAll((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  User.update(userId, userData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  User.delete(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};