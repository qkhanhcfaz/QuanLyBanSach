const express = require("express");
const router = express.Router();
const {
  updateOrderStatus,
  getAllOrders,
  createOrder,
  getOrderById,
  softDeleteOrder,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Tạo đơn hàng mới (User)
// POST /api/orders
router.post("/", protect, createOrder);

// GET /api/orders - Lấy danh sách đơn hàng (Chỉ Admin)
router.get("/", protect, admin, getAllOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng (Chỉ Admin)
router.get("/:id", protect, admin, getOrderById);

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng (Chỉ Admin)
router.put("/:id/status", protect, admin, updateOrderStatus);

// DELETE /api/orders/:id - Xóa mềm đơn hàng (Chỉ Admin)
router.delete("/:id", protect, admin, softDeleteOrder);

module.exports = router;
