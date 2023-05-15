const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const upload = require("../middlewares/fileUpload");
const {
    createUser,
    getUserList,
    updateUser,
    deleteUser,
    updateUserImage,
} = require('../controllers/adminController');

router.route('/').post(protect, isAdmin, createUser);
router.route('/').get(protect, isAdmin, getUserList);
router.route('/:id').put(protect, isAdmin, updateUser);
router.route('/:id').delete(protect, isAdmin, deleteUser);
router.route('/:id/image').post(protect, isAdmin, upload.single('image'), updateUserImage);

module.exports = router;