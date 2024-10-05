const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userData = req.body;
  User.create(userData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.getByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user.user_id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  });
};