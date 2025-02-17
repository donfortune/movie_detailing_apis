const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');

route.get('/users', userController.getAllUsers);
route.post('/users', userController.createUser);
route.put('/users/:id', userController.updateUser);
route.get('/users/:id', userController.getUserById);

module.exports = route;