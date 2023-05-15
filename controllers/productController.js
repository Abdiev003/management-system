const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");

exports.createProduct = asyncHandler(async (req, res) => {
    const { name, description, price } = req.body;

    const productExists = await Product.findOne({ name });

    if (productExists) {
        res.status(409).json({ message: 'User already exists' });
    }

    const product = await Product.create({
        name,
        description,
        price,
    });

    if (product) {
        res.status(201).json({
            _id: product._id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
        });
    } else {
        res.status(400).json({ message: 'Invalid product data' });
    }
});

exports.getProductList = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;

        const updatedProduct = await product.save();

        res.json({
            _id: updatedProduct._id,
            name: updatedProduct.name,
            slug: updatedProduct.slug,
            description: updatedProduct.description,
            price: updatedProduct.price,
        });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});