const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middlewares/authMiddleware')
// Placeholder routes for admin view router
router.get('/', (req, res) => {
    res.render('admin/pages/dashboard', { title: 'Admin Dashboard' });
});

// Simple render handler for admin products page
const renderAdminProducts = (req, res) => {
    res.render('admin/pages/products', { title: 'Admin Products' });
};

router.get('/products', protect, admin, renderAdminProducts);

module.exports = router;
