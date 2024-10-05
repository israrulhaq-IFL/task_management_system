const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    bcrypt.hash(userData.password, 10, (err, hash) => {
      if (err) return callback(err);
      userData.password = hash;
      const sql = 'INSERT INTO users SET ?';
      db.query(sql, userData, callback);
    });
  },
  getById: (userId, callback) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.query(sql, [userId], callback);
  },
  getByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, callback);
  },
  update: (userId, userData, callback) => {
    if (userData.password) {
      bcrypt.hash(userData.password, 10, (err, hash) => {
        if (err) return callback(err);
        userData.password = hash;
        const sql = 'UPDATE users SET ? WHERE user_id = ?';
        db.query(sql, [userData, userId], callback);
      });
    } else {
      const sql = 'UPDATE users SET ? WHERE user_id = ?';
      db.query(sql, [userData, userId], callback);
    }
  },
  delete: (userId, callback) => {
    const sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql, [userId], callback);
  }
};

module.exports = User;