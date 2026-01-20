const express = require("express");
const router = express.Router();
const {
  updateOrderStatus,
  getAllOrders,
  createOrder,
  getOrderById,
  getMyOrders,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

// POST /api/orders - Tạo đơn hàng (User đã đăng nhập)
router.post("/", protect, createOrder);

// GET /api/orders - Lấy danh sách đơn hàng (Chỉ Admin)
router.get("/", protect, admin, getAllOrders);

// GET /api/orders/myorders - Lấy danh sách đơn hàng của tôi
router.get("/myorders", protect, getMyOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng (Admin hoặc Owner)
router.get("/:id", protect, getOrderById);

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Chỉ Admin)
router.put("/:id/status", protect, admin, updateOrderStatus);

// Tạo đơn hàng mới (User)
// POST /api/orders
router.post("/", protect, createOrder);

module.exports = router;
