const jwt = require('jsonwebtoken');
const User = require("/Users/mac/movie_detailing_api/models/userModel.js") // Adjust based on your project structure
require('dotenv').config();

exports.protectRoutes = async (req, res, next) => {
    try {
        let token; // Declare token variable, why? Because we want to use it outside the if block. for? To check if token exists

        // Extract token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } 

        // Check if token exists
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await User.findById(decoded.id); // 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user object to request
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};