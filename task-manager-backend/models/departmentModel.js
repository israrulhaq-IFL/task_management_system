const db = require('../config/db'); // Use the db configuration from db.js

const Department = {
  create: (departmentData, callback) => {
    const sql = 'INSERT INTO departments SET ?';
    db.query(sql, departmentData, callback);
  },
  getById: (departmentId, callback) => {
    const sql = 'SELECT * FROM departments WHERE department_id = ?';
    db.query(sql, [departmentId], callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM departments';
    db.query(sql, callback);
  },
  update: (departmentId, departmentData, callback) => {
    const sql = 'UPDATE departments SET ? WHERE department_id = ?';
    db.query(sql, [departmentData, departmentId], callback);
  },
  delete: (departmentId, callback) => {
    const sql = 'DELETE FROM departments WHERE department_id = ?';
    db.query(sql, [departmentId], callback);
  }
};

module.exports = Department;