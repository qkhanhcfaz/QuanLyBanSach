const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// GET /api/payment/vnpay_return
router.get("/vnpay_return", paymentController.vnpayReturn);

module.exports = router;
