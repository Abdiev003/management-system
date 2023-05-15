const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const {generateSlug} = require("../helpers/generateSlug");

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

// generate slug from name
ProductSchema.pre('save', async function(next) {
    this.slug = generateSlug(this.name);
    next();
});

module.exports = mongoose.model('Product', ProductSchema);