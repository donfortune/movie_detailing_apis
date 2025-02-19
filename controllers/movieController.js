const Movie = require("/Users/mac/movie_detailing_api/models/movieModel.js") // Adjust based on your project structure
const mongoose = require('mongoose');

// Get all movies excluding the ones that are soft deleted
// exports.getAllMovies = async (req, res) => {
//     try {
//         const movies = await Movie.find({isDeleted: false}); // Fetch all movies that are not deleted
//         res.status(200).json({
//             status: 'success',
//             data: movies
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(400).json({
//             status: 'fail',
//             message: error
//         })
//     }
// }

//Get all movies including the ones that are soft deleted
exports.getAllMovies = async (req, res) => {
    try {
        console.log(mongoose.modelNames());

        const movies = await Movie.find(); // Fetch all movies
        res.status(200).json({
            status: 'success',
            data: movies
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.addMovie = async (req, res) => {
    try {
        // const { title, description, rating } = req.body; // Destructure the request body
        // i wan the entire request body
        const { body } = req; // Destructure the request body
        if (!body) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide title, description, and rating'
            });
        }
        const existingMovie = await Movie.findOne({ title: body.title });
        if (existingMovie) {
            return res.status(400).json({
                status: 'fail',
                message: 'Movie with this title already exists'
            });
        }
        const movie = await Movie.create({ ...body }); 
        res.status(201).json({
            status: 'success',
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide the fields you wish to edit'
            });
        }
        const movie = await Movie.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({
            status: 'success',
            data: movie
        });
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'Movie not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
        
    }

}

// soft delete
exports.deleteMovie = async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'Movie not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}