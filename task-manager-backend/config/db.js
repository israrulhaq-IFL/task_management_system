const mysql = require('mysql');
require('dotenv').config(); // Import and configure dotenv
const logger = require('./logger'); // Import the logger

const db = mysql.createConnection({
  host: process.env.DB_PROJECT1_HOST || 'localhost',
  user: process.env.DB_PROJECT1_USERNAME || 'root',
  password: process.env.DB_PROJECT1_PASSWORD || '',
  database: process.env.DB_PROJECT1_DATABASE || 'task_manager',
  port: process.env.DB_PORT || 3306
});

db.connect(err => {
  if (err) {
    logger.error(`MySQL connection error: ${err.message}`);
    throw err;
  }
  logger.info('MySQL connected...');
});

module.exports = db;