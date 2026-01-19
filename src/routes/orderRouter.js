const express = require('express');
const router = express.Router();
const { updateOrderStatus, getAllOrders, createOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Route cập nhật trạng thái đơn hàng (Admin)
// PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, updateOrderStatus);

// Lấy danh sách đơn hàng (Admin)
// GET /api/orders
router.get('/', protect, admin, getAllOrders);

// Tạo đơn hàng mới (User)
// POST /api/orders
router.post('/', protect, createOrder);

// Hủy đơn hàng (User)
// PUT /api/orders/:id/cancel
const { getMyOrders, cancelOrder, reorderOrder, getOrderDetails } = require('../controllers/orderController');
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderDetails); // Thêm route này
router.put('/:id/cancel', protect, cancelOrder);

// Mua lại đơn hàng (User)
// PUT /api/orders/:id/reorder
router.put('/:id/reorder', protect, reorderOrder);

module.exports = router;
