const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', protect, admin, roleController.getAllRoles);

module.exports = router;
