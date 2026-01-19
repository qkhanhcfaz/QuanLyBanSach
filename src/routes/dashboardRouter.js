const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getBestSellingProducts,
} = require("../controllers/dashboardController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET /api/dashboard/stats?startDate=...&endDate=...
router.get("/stats", protect, admin, getDashboardStats);

// GET /api/dashboard/best-selling?startDate=...&endDate=...
router.get("/best-selling", protect, admin, getBestSellingProducts);

module.exports = router;
