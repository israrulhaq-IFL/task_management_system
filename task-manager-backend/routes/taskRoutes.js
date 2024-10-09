const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.get('/', taskController.getAllTasks);
router.get('/department/:departmentId', taskController.getTasksByDepartment);
router.get('/sub-department/:subDepartmentId', taskController.getTasksBySubDepartment);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
// Update task status
router.put('/:id/status', taskController.updateTaskStatus);

module.exports = router;