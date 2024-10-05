const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

router.post('/register', [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], authController.register);

router.post('/login', [
  check('email').isEmail().withMessage('Please include a valid email'),
  check('password').exists().withMessage('Password is required')
], authController.login);

module.exports = router;