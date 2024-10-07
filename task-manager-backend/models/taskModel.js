const db = require('../config/db');

const Task = {
  create: (taskData, callback) => {
    const sql = 'INSERT INTO tasks SET ?';
    db.query(sql, taskData, callback);
  },
  getById: (taskId, callback) => {
    const sql = 'SELECT * FROM tasks WHERE task_id = ?';
    db.query(sql, [taskId], callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, callback);
  },
  getByDepartment: (departmentId, callback) => {
    const sql = 'SELECT * FROM tasks WHERE department_id = ?';
    db.query(sql, [departmentId], callback);
  },
  getBySubDepartment: (subDepartmentId, callback) => {
    const sql = 'SELECT * FROM tasks WHERE sub_department_id = ?';
    db.query(sql, [subDepartmentId], callback);
  },
  update: (taskId, taskData, callback) => {
    const sql = 'UPDATE tasks SET ? WHERE task_id = ?';
    db.query(sql, [taskData, taskId], callback);
  },
  delete: (taskId, callback) => {
    const sql = 'DELETE FROM tasks WHERE task_id = ?';
    db.query(sql, [taskId], callback);
  }
};

module.exports = Task;