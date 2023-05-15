const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const {generateToken} = require("../helpers/jwtHelper");
const {getBearerToken} = require("../helpers/parseHeader");
const Blacklist = require("../models/tokenModel");

exports.register = asyncHandler(async (req, res) => {
    const {username, password, role} = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(409).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

exports.login = asyncHandler(async (req, res) => {
    const{ username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user && !(await user.matchPassword(password))) {
        res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        accessToken: generateToken(user._id),
    });
});

exports.logout = asyncHandler(async (req, res) => {
    try {
        const accessToken = getBearerToken(req.headers);
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });

        if (checkIfBlacklisted) return res.status(204);

        const newBlacklist = new Blacklist({
            token: accessToken,
        });
        await newBlacklist.save();
        res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
});