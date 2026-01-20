const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Áp dụng middleware bảo vệ cho tất cả các route bên dưới
// 1. Các route cho user đã đăng nhập (cần token nhưng không cần quyền Admin)
// GET /api/users/profile
// PUT /api/users/profile
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

// 2. Các route quản lý User (chỉ dành cho Admin)
// Áp dụng middleware admin cho các route bên dưới
router.use(protect, admin);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
