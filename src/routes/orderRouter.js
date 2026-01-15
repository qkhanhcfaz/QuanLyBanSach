const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET /api/orders - Lấy danh sách đơn hàng (Chỉ Admin)
router.get("/", protect, admin, getAllOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng (Chỉ Admin)
router.get("/:id", protect, admin, getOrderById);

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Chỉ Admin)
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
