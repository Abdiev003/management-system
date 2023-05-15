const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Blacklist = require('../models/tokenModel');
const {getBearerToken} = require("../helpers/parseHeader");

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = getBearerToken(req.headers)
            const checkIfBlacklisted = await Blacklist.findOne({ token });

            if (checkIfBlacklisted) {
                res.status(401).json({ message: 'This session has expired.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({
                message: 'Not authorized, token failed',
            });
        }
    }

    if (!token) {
        res.status(401).json({
            message: 'Not authorized, no token',
        });
    }
});

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({
            message: 'Not authorized as an admin',
        });
    }
};