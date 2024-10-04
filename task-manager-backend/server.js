const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.send('Task Manager API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});