const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
} = require("../controllers/orderController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET /api/orders - Lấy danh sách đơn hàng (Chỉ Admin)
router.get("/", protect, admin, getAllOrders);

// GET /api/orders/:id - Lấy chi tiết đơn hàng (Chỉ Admin)
router.get("/:id", protect, admin, getOrderById);

module.exports = router;
