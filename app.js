const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const requestLogger = require("./middlewares/requestLogger");

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB Connection Success'))
    .catch(err => console.error(err));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.json());
app.use(requestLogger);

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/users', adminRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);

module.exports = app;