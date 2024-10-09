const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Define routes for user operations
 // No authentication required for creating a user
router.get('/me', authMiddleware, userController.getUserById);
router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:id', authMiddleware, userController.updateUser); 
router.delete('/:id', authMiddleware, userController.deleteUser);
router.get('/:id', authMiddleware, userController.getUserById); // Add this line


module.exports = router;