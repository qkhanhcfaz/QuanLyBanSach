<<<<<<< HEAD
const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.get("/stats", protect, admin, getDashboardStats);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/stats?startDate=...&endDate=...
router.get('/stats', dashboardController.getDashboardStats);

// GET /api/dashboard/best-selling?startDate=...&endDate=...
router.get('/best-selling', dashboardController.getBestSellingProducts);

module.exports = router;
>>>>>>> 77da11814b85677759fc226a8054ba992b7611f8
