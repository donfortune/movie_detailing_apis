const express = require('express');
const route = express.Router();
const screeningController = require('/Users/mac/movie_detailing_api/controllers/screnningController.js');

route.get('/screenings', screeningController.getAllScreenings);
route.post('/screenings', screeningController.addScreening);
route.get('/screenings/highest-grossing', screeningController.getHighestGrossingScreening);

module.exports = route;