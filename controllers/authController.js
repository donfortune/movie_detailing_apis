const USER = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide name, email, and password'
            });
        }

        // to avoid duplicate emails error, do a check here
        const existingUser = await USER.findOne({ email });
        // const existingUser = await USER.findOne($or: [{ email: email }, { name: name }]); // 
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User with this email already exists'
            });
        }

        const newUser = await USER.create({ name, email, password });
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

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        const isMatch = await bycrypt.compare(password, user.password); // compare the password
        if (!isMatch) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid password'
            });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }); // create a token
        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        console.error("Error signing in user:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}
