const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

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


port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})