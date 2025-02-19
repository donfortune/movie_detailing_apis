const Screening = require('/Users/mac/movie_detailing_api/models/screeningSchema.js');
const mongoose = require('mongoose');

exports.getAllScreenings = async (req, res) => {
    try {
        const nScreenings = await Screening.find().lean();
        console.log(nScreenings);
        const screenings = await Screening.find();
        if (screenings.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No screenings found'
            });
        } 
        res.status(200).json({
            status: 'success',
            data: screenings
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.addScreening = async (req, res) => {
    try {
        const  { movieId, cinemaId, showTime, viewers, revenue } = req.body;
        if (!movieId || !cinemaId || !showTime || !viewers || !revenue) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide movieId, cinemaId, showTime, viewers, revenue'
            });
        }
        const existingScreening = await Screening.findOne({ movieId, cinemaId, showTime });
        if (existingScreening) {
            return res.status(400).json({
                status: 'fail',
                message: 'Screening with this movie, cinema and showtime already exists'
            });
        }
        const screening = (await Screening.create({ movieId, cinemaId, showTime, viewers, revenue }));
        res.status(201).json({
            status: 'success',
            
            data: screening
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

exports.getHighestGrossingScreening = async (req, res) => {
    try {
        

        const screenings = await Screening.find().sort({ revenue: -1 }).limit(1).populate({ path: 'movieId', select: 'title' }); 
        console.log("Debugging Output:", screenings);
        if (screenings.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No screenings found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: screenings
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({  
            status: 'fail',
            message: error
        })
    }
}

