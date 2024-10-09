const db = require('../config/db');

const Task = {
  create: (taskData, assignees, subDepartments, callback) => {
    const sql = 'INSERT INTO tasks SET ?';
    db.query(sql, taskData, (err, result) => {
      if (err) return callback(err);

      const taskId = result.insertId;

      // Insert into task_assignees
      if (Array.isArray(assignees) && assignees.length > 0) {
        const assigneeValues = assignees.map(userId => [taskId, userId]);
        const assigneeSql = 'INSERT INTO task_assignees (task_id, user_id) VALUES ?';
        db.query(assigneeSql, [assigneeValues], (err) => {
          if (err) return callback(err);
        });
      }

      // Insert into task_sub_departments
      if (Array.isArray(subDepartments) && subDepartments.length > 0) {
        const subDepartmentValues = subDepartments.map(subDepartmentId => [taskId, subDepartmentId]);
        const subDepartmentSql = 'INSERT INTO task_sub_departments (task_id, sub_department_id) VALUES ?';
        db.query(subDepartmentSql, [subDepartmentValues], (err) => {
          if (err) return callback(err);
        });
      }

      callback(null, result);
    });
  },

  getById: (taskId, callback) => {
    const sql = `
      SELECT t.*, 
             GROUP_CONCAT(DISTINCT ta.user_id) AS assignees, 
             GROUP_CONCAT(DISTINCT tsd.sub_department_id) AS sub_departments
      FROM tasks t
      LEFT JOIN task_assignees ta ON t.task_id = ta.task_id
      LEFT JOIN task_sub_departments tsd ON t.task_id = tsd.task_id
      WHERE t.task_id = ?
      GROUP BY t.task_id
    `;
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

  update: (taskId, taskData, assignees, subDepartments, callback) => {
    const sql = 'UPDATE tasks SET ? WHERE task_id = ?';
    db.query(sql, [taskData, taskId], (err, result) => {
      if (err) return callback(err);

      // Update task_assignees
      const deleteAssigneesSql = 'DELETE FROM task_assignees WHERE task_id = ?';
      db.query(deleteAssigneesSql, [taskId], (err) => {
        if (err) return callback(err);

        if (Array.isArray(assignees) && assignees.length > 0) {
          const assigneeValues = assignees.map(userId => [taskId, userId]);
          const assigneeSql = 'INSERT INTO task_assignees (task_id, user_id) VALUES ?';
          db.query(assigneeSql, [assigneeValues], (err) => {
            if (err) return callback(err);
          });
        }
      });

      // Update task_sub_departments
      const deleteSubDepartmentsSql = 'DELETE FROM task_sub_departments WHERE task_id = ?';
      db.query(deleteSubDepartmentsSql, [taskId], (err) => {
        if (err) return callback(err);

        if (Array.isArray(subDepartments) && subDepartments.length > 0) {
          const subDepartmentValues = subDepartments.map(subDepartmentId => [taskId, subDepartmentId]);
          const subDepartmentSql = 'INSERT INTO task_sub_departments (task_id, sub_department_id) VALUES ?';
          db.query(subDepartmentSql, [subDepartmentValues], (err) => {
            if (err) return callback(err);
          });
        }
      });

      callback(null, result);
    });
  },

  delete: (taskId, callback) => {
    const sql = 'DELETE FROM tasks WHERE task_id = ?';
    db.query(sql, [taskId], (err, result) => {
      if (err) return callback(err);

      const deleteAssigneesSql = 'DELETE FROM task_assignees WHERE task_id = ?';
      db.query(deleteAssigneesSql, [taskId], (err) => {
        if (err) return callback(err);
      });

      const deleteSubDepartmentsSql = 'DELETE FROM task_sub_departments WHERE task_id = ?';
      db.query(deleteSubDepartmentsSql, [taskId], (err) => {
        if (err) return callback(err);
      });

      callback(null, result);
    });
  }
};

module.exports = Task;