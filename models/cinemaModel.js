const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cinemaSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
   
})

const Cinema = mongoose.model('Cinema', cinemaSchema);
module.exports = Cinema;