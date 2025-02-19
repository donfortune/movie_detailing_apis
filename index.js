const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
const screeningRoutes = require('/Users/mac/movie_detailing_api/routes/screnningRoutes.js');

env.config();
const app = express();

app.use(express.json()); // to parse the incoming request with JSON payloads

const connectDb = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            
        })
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database', error);
    }
}

connectDb();

const cookieParser = require("cookie-parser");

app.use(cookieParser());


app.use('/api/v1', userRoutes);
app.use('/api/v1', movieRoutes);
app.use('/api/v1', cinemaRoutes);
app.use('/api/v1', screeningRoutes);


port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})