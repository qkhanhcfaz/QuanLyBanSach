const express = require('express');
const router = express.Router();
const { updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Route cập nhật trạng thái đơn hàng (Admin)
// PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Lấy danh sách đơn hàng (Admin)
// GET /api/orders
router.get('/', protect, admin, getAllOrders);

module.exports = router;
