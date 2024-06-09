const JWT = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const requireSignIn = (req, res, next) => {
    try {
        // Verify JWT token and decode payload
        const decoded = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        // Attach the decoded payload to the request object
        req.user = decoded;
        // Call the next middleware
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized Access'
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        // Retrieve user from database using decoded user ID
        const user = await UserModel.findById(req.user._id);
        // Check if user exists and has admin role
        if (!user || user.role !== 1) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized Access'
            });
        }
        // If user is admin, call the next middleware
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

module.exports = { requireSignIn, isAdmin };
