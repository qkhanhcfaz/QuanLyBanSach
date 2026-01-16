const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/toggle', protect, favoriteController.toggleFavorite);

module.exports = router;
