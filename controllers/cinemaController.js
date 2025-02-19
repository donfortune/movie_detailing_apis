const { default: mongoose } = require('mongoose');
const Cinema = require('../models/cinemaModel');

exports.getAllCinemas = async (req, res) => {
    try {
        const cinemas = await Cinema.find();
        if (cinemas.length === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'No cinemas found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: cinemas
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}

exports.addCinema = async (req, res) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, location'
            });
        }
        const existingCinema = await Cinema.findOne({ name, location });
        if (existingCinema) {
            return res.status(400).json({
                status: 'fail',
                message: 'Cinema with this name and location already exists'
            });
        }
        const cinema = await Cinema.create({ name, location });
        res.status(201).json({
            status: 'success',
            data: cinema
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

exports.updateCinema = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Validate the cinema ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid cinema ID'
            });
        }

        // Validate the request body to make sure it is not empty
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide the fields you wish to edit'
            });
        }

        // Check if the cinema exists
        const cinema = await Cinema.findById(id);
        if (!cinema) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cinema not found'
            });
        }

        // Check for duplicate cinema name/location (excluding current cinema)
        const existingCinema = await Cinema.findOne({ 
            name: updatedData.name, 
            location: updatedData.location, 
            _id: { $ne: id } // Exclude the current cinema from the check
        });

        if (existingCinema) {
            return res.status(400).json({
                status: 'fail',
                message: 'Cinema with this name and location already exists'
            });
        }

        // Update the cinema
        const updatedCinema = await Cinema.findByIdAndUpdate(id, updatedData, { 
            new: true, 
            runValidators: true // Ensures schema validation
        });

        res.status(200).json({
            status: 'success',
            data: updatedCinema
        });

    } catch (error) {
        console.error('Error updating cinema:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}; 

exports.deleteCinema = async (req, res) => {
    try {
        const id = req.params.id;
        const cinema = await Cinema.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!cinema) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cinema not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Cinema deleted successfully'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}