const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { createContact, getAllContacts, deleteContact } = require('../controllers/contactController');

// Public route: Gửi liên hệ
router.post('/', createContact);

// Admin routes: Xem và Xóa
router.get('/', protect, admin, getAllContacts);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
