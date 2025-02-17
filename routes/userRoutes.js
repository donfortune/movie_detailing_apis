const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

route.get('/users', userController.getAllUsers);
route.post('/users', userController.createUser);
route.put('/users/:id', userController.updateUser);
route.get('/users/:id', userController.getUserById);

// Auth routes
route.post('/signup', authController.signup);
route.post('/signin', authController.signIn);

module.exports = route;