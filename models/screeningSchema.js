const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const screnningSchema = new Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true
    },
    showTime: {
        type: Date,
        required: true
    },
    viewers: {
        type: Number,
        required: true
    },
    revenue: {
        type: Number,
        required: true
    }
})

const Screening = mongoose.model('Screening', screnningSchema);
module.exports = Screening;