const db = require('../config/db'); // Use the db configuration from db.js

const SubDepartment = {
  create: (subDepartmentData, callback) => {
    const sql = 'INSERT INTO sub_departments SET ?';
    db.query(sql, subDepartmentData, callback);
  },
  getById: (subDepartmentId, callback) => {
    const sql = 'SELECT * FROM sub_departments WHERE sub_department_id = ?';
    db.query(sql, [subDepartmentId], callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM sub_departments';
    db.query(sql, callback);
  },
  update: (subDepartmentId, subDepartmentData, callback) => {
    const sql = 'UPDATE sub_departments SET ? WHERE sub_department_id = ?';
    db.query(sql, [subDepartmentData, subDepartmentId], callback);
  },
  delete: (subDepartmentId, callback) => {
    const sql = 'DELETE FROM sub_departments WHERE sub_department_id = ?';
    db.query(sql, [subDepartmentId], callback);
  }
};

module.exports = SubDepartment;