const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// User Profile Routes (Must be before /:id routes to avoid conflict)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.put('/change-password', protect, changePassword);

// Áp dụng middleware protect và admin cho tất cả các route dưới đây để bảo mật
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserById);
router.post('/', protect, admin, createUser);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
