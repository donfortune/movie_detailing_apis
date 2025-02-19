const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: users
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}


exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, email, and password'
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User with this email already exists'
            });
        }
        // Create the user (password will be hashed automatically by the schema)
        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            status: 'success',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const id = req.params.id;
        if (!name || !email ) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, email'
            });
        }

        let updatedData = {
            name: name,
            email: email,
        };
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide id'
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}