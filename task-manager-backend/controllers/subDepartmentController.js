const db = require('../config/db'); // Use the db configuration from db.js

exports.createSubDepartment = (req, res) => {
  const { sub_department_name, manager_id, department_id } = req.body;
  const sql = 'INSERT INTO sub_departments (sub_department_name, manager_id, department_id) VALUES (?, ?, ?)';
  db.query(sql, [sub_department_name, manager_id, department_id], (err, result) => {
    if (err) {
      console.error('Error creating sub-department:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ sub_department_id: result.insertId, sub_department_name, manager_id, department_id });
  });
};

exports.getSubDepartmentById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM sub_departments WHERE sub_department_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching sub-department:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(result[0]);
  });
};

exports.getAllSubDepartments = (req, res) => {
  const sql = `
    SELECT sd.sub_department_id, sd.sub_department_name, u.name AS manager_name, d.department_name
    FROM sub_departments sd
    JOIN users u ON sd.manager_id = u.user_id
    JOIN departments d ON sd.department_id = d.department_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching sub-departments:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

exports.updateSubDepartment = (req, res) => {
  const { id } = req.params;
  const { sub_department_name, manager_id, department_id } = req.body;
  const sql = 'UPDATE sub_departments SET ? WHERE sub_department_id = ?';
  db.query(sql, [{ sub_department_name, manager_id, department_id }, id], (err, result) => {
    if (err) {
      console.error('Error updating sub-department:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Sub-department updated successfully' });
  });
};

exports.deleteSubDepartment = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM sub_departments WHERE sub_department_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting sub-department:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Sub-department deleted successfully' });
  });
};