const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the authentication middleware

// Define routes for user operations
router.get('/me', authMiddleware, userController.getUserById);
router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:id', authMiddleware, userController.updateUser); 
router.delete('/:id', authMiddleware, userController.deleteUser);
router.get('/:id', authMiddleware, userController.getUserById); 

// Add detailed logging for the last three routes
router.get('/manager', authMiddleware, (req, res, next) => {
  console.log('Route /manager hit');
  next();
}, userController.getUsersForManager);

router.get('/team-member', authMiddleware, (req, res, next) => {
  console.log('Route /team-member hit');
  next();
}, userController.getUsersForTeamMember);

router.get('/hod', authMiddleware, (req, res, next) => {
  console.log('Route /hod hit');
  next();
}, userController.getUsersForHOD);

module.exports = router;