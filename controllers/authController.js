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
        //
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
        
        // Generate tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        // Store refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        // Attach refresh token to HTTP-Only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            status: 'success',
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Error signing in user:", error.message);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies; // Get refresh token from cookie
        if (!refreshToken) {
            return res.status(403).json({ status: "fail", message: "No refresh token provided" });
        }

        // Find user by refresh token
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ status: "fail", message: "Invalid refresh token" });
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err || decoded.id !== user._id.toString()) {
                return res.status(403).json({ status: "fail", message: "Invalid token" });
            }

            // Generate a new access token
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

            res.status(200).json({ status: "success", accessToken });
        });
    } catch (error) {
        console.error("Error refreshing token:", error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

exports.signOut = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({ status: "fail", message: "User not logged in" });
        }

        // Find user and remove refresh token
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
