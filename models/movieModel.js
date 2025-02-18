const mongoose = require('mongoose');
const schema = mongoose.Schema;


const movieSchema = new schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    actors: {
        type: [String],
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    
})

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;