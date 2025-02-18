const express = require('express');
const route = express.Router();
const movieController = require('../controllers/movieController');

route.get('/movies', movieController.getAllMovies);
route.post('/movies', movieController.addMovie);
route.put('/movies/:id', movieController.updateMovie);
route.delete('/movies/:id', movieController.deleteMovie);

module.exports = route;