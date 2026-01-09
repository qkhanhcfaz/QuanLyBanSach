const express = require('express');
const router = express.Router();

// Placeholder routes for admin view router
router.get('/', (req, res) => {
    res.render('admin/pages/dashboard', { title: 'Admin Dashboard' });
});

module.exports = router;
