const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const logger = require('./config/logger'); // Import the logger

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Use task routes
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager API');
});

// Error handling middleware to log errors
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});