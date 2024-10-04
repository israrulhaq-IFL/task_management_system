const db = require('../config/db');

const Task = {
  create: (task, callback) => {
    const sql = 'INSERT INTO tasks SET ?';
    db.query(sql, task, callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, callback);
  },
  update: (id, task, callback) => {
    const sql = 'UPDATE tasks SET ? WHERE id = ?';
    db.query(sql, [task, id], callback);
  },
  delete: (id, callback) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, id, callback);
  }
};

module.exports = Task;