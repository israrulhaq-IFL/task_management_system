const db = require('../config/db'); // Use the db configuration from db.js

const User = {
  create: (userData, callback) => {
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, userData, callback);
  },
  getById: (userId, callback) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.query(sql, [userId], callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, callback);
  },
  update: (userId, userData, callback) => {
    const sql = 'UPDATE users SET ? WHERE user_id = ?';
    db.query(sql, [userData, userId], callback);
  },
  delete: (userId, callback) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql, [userId], callback);
  }
};

module.exports = User;