const mongoose = require('mongoose');
const {hashPassword, comparePassword} = require("../helpers/hashHelper");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'personal'],
        default: 'personal',
    },
},{
    timestamps: true,
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await hashPassword(this.password)
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await comparePassword(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);