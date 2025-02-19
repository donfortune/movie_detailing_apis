const express = require('express');
const route = express.Router();
const cinemaController = require('../controllers/cinemaController');

route.get('/cinemas', cinemaController.getAllCinemas);
route.post('/cinemas', cinemaController.addCinema);
route.delete('/cinemas/:id', cinemaController.deleteCinema);
route.put('/cinemas/:id', cinemaController.updateCinema);

module.exports = route;