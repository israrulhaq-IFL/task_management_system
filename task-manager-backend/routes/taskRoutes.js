const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTaskById);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/department/:departmentId', taskController.getTasksByDepartment);
router.get('/tasks/sub-department/:subDepartmentId', taskController.getTasksBySubDepartment);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;