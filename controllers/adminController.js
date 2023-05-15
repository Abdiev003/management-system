const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const {generateToken} = require("../helpers/jwtHelper");

exports.createUser = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;

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
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

exports.getUserList = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.role = req.body.role || user.role;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

exports.updateUserImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.image = '/uploads/' + req.file.filename;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
            image: updatedUser.image,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});