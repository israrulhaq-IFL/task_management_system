const mysql = require('mysql');
const logger = require('./logger'); // Import the logger

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager'
});

db.connect(err => {
  if (err) {
    logger.error(`MySQL connection error: ${err.message}`); // Log the error
    throw err;
  }
  logger.info('MySQL connected...'); // Log successful connection
});


module.exports = db;