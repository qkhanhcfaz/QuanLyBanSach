const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/stats?startDate=...&endDate=...
router.get("/stats", dashboardController.getDashboardStats);

// GET /api/dashboard/best-selling?startDate=...&endDate=...
router.get("/best-selling", dashboardController.getBestSellingProducts);

module.exports = router;
