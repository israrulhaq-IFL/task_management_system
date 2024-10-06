const User = require('../models/userModel'); // Ensure this path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Load environment variables
require('dotenv').config();

const blacklist = []; // Define the blacklist array

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userData = req.body;
  console.log('Registering user with data:', userData); // Log the user data

  bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Hashed password:', hashedPassword); // Log the hashed password
    userData.password = hashedPassword;

    User.create(userData, (err, result) => {
      if (err) {
        console.error('Error creating user:', err.message);
        return res.status(500).json({ error: err.message });
      }
      const apiKey = jwt.sign({ id: result.insertId, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated API key:', apiKey); // Log the generated API key
      res.status(201).json({ message: 'User registered successfully', apiKey });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password }); // Log the login request

  User.getByEmail(email, (err, user) => {
    if (err) {
      console.error('Error fetching user by email:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Stored hashed password:', user.password); // Log the stored hashed password

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (!isMatch) {
        console.log('Password does not match for user:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const apiKey = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated API key:', apiKey); // Log the generated API key
      res.status(200).json({ apiKey });
    });
  });
};



exports.logout = (req, res) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token received for logout:', token); // Log the token received

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Log the decoded token
    blacklist.push(token); // Add the token to the blacklist
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Invalid token:', error.message); // Log the error message
    res.status(401).send({ error: 'Invalid token' });
  }
};

// Middleware to check if token is blacklisted
exports.checkBlacklist = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (blacklist.includes(token)) {
    return res.status(401).send({ error: 'Token has been invalidated' });
  }
  next();
};