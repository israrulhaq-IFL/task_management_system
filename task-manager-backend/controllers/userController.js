const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.getUserById = (req, res) => {
  const userId = req.user.user_id; // Use the user ID from the authenticated user
  console.log('Fetching user with ID:', userId); // Log the user ID

  User.getById(userId, (err, user) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User found:', user); // Log the user
    res.json(user);
  });
};

exports.getAllUsers = (req, res) => {
  const role = req.query.role;

  User.getAll((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If a role is specified, filter the results
    if (role) {
      const filteredUsers = result.filter(user => user.role === role);
      return res.status(200).json(filteredUsers);
    }

    // If no role is specified, return all users
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
  const userIdToDelete = req.params.id;
  const token = req.headers.authorization.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Error decoding token:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const loggedInUserId = decodedToken.id; // Ensure this matches the token structure
  const loggedInUserRole = decodedToken.role; // Assuming role is included in the token

  console.log('User ID to delete:', userIdToDelete);
  console.log('Logged in user ID:', loggedInUserId);
  console.log('Logged in user role:', loggedInUserRole);

  // Check if the logged-in user is trying to delete their own account
  if (userIdToDelete === loggedInUserId.toString()) {
    console.log('Attempt to delete own account');
    return res.status(403).json({ error: 'You cannot delete your own account.' });
  }

  // Allow Super Admin to delete other users
  if (loggedInUserRole === 'Super Admin') {
    User.delete(userIdToDelete, (err, result) => {
      if (err) {
        console.error('Error deleting user:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('User deleted successfully');
      return res.status(200).json({ message: 'User deleted successfully' });
    });
  } else {
    // For other roles, add additional checks if necessary
    console.log('Permission denied for user role:', loggedInUserRole);
    return res.status(403).json({ error: 'You do not have permission to delete this user.' });
  }
};