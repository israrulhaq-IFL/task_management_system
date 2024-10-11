const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, userData, callback);
  },
  getById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  getByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  getAll: (callback) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
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
  },
 
  getUsersForManager: async (managerId) => {
    try {
      const [rows] = await db.query(`
        SELECT u.user_id
        FROM users u
        JOIN sub_departments sd ON u.sub_department_id = sd.sub_department_id
        WHERE sd.manager_id = ?
      `, [managerId]);

      if (!rows) {
        throw new Error('No users found for the given manager');
      }

      return rows;
    } catch (error) {
      console.error('Error fetching users for Manager:', error);
      throw error;
    }
  },
  getUsersForTeamMember: async (department_id) => {
    const query = `
      SELECT u.user_id, u.name, u.email, u.role, u.department_id, u.sub_department_id
      FROM users u
      WHERE u.department_id = ?
    `;
    console.log('Executing query for team member:', query); // Debugging log
    const [users] = await db.query(query, [department_id]);
    console.log('Query result for team member:', users); // Debugging log
    return users;
  },
  getUsersForHOD: async () => {
    const query = `
      SELECT u.user_id, u.name, u.email, u.role, u.department_id, u.sub_department_id
      FROM users u
      WHERE u.role = 'HOD'
    `;
    console.log('Executing query for HOD:', query); // Debugging log
    const [users] = await db.query(query);
    console.log('Query result for HOD:', users); // Debugging log
    return users;
  }
};

module.exports = User;