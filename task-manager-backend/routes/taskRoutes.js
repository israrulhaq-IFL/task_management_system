const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/manager', authMiddleware, taskController.getTasksForManager);
router.put('/:id/status', taskController.updateTaskStatus);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.get('/', taskController.getAllTasks);
router.get('/department/:departmentId', taskController.getTasksByDepartment);
router.get('/sub-department/:subDepartmentId', taskController.getTasksBySubDepartment);

router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
// Update task status


module.exports = router;