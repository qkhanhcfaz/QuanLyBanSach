const express = require('express');
const router = express.Router();
const { updateOrderStatus, getAllOrders, createOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Tạo đơn hàng mới (User)
// POST /api/orders
router.post('/', protect, createOrder);

// Route cập nhật trạng thái đơn hàng (Admin)
// PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Lấy danh sách đơn hàng (Admin)
// GET /api/orders
router.get('/', protect, admin, getAllOrders);

module.exports = router;
