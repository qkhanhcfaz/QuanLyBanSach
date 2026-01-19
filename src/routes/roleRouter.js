const express = require('express');
const router = express.Router();
const { getAllRoles } = require('../controllers/roleController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Lấy danh sách vai trò (Cần quyền admin để xem và gán)
router.get('/', protect, admin, getAllRoles);

module.exports = router;
