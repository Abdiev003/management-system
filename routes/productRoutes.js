const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const {
    createProduct,
    getProductList,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

router.route('/').post(protect, isAdmin, createProduct);
router.route('/').get(getProductList);
router.route('/:id').put(protect, isAdmin, updateProduct);
router.route('/:id').delete(protect, isAdmin, deleteProduct);

module.exports = router;