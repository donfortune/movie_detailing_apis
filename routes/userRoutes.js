const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { protectRoutes } = require('../middlewares/authMiddlewares');

route.get('/users',  protectRoutes, userController.getAllUsers);
route.post('/users', userController.createUser);
route.put('/users/:id', userController.updateUser);
route.get('/users/:id', userController.getUserById);

// Auth routes
route.post('/signup', authController.signup);
route.post('/signin', authController.signIn);
route.post('/refresh-token', authController.refreshToken);
route.post('/signout', authController.signOut);

module.exports = route;