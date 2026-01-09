const express = require('express');
const router = express.Router();

// Placeholder routes for auth router
router.post('/login', (req, res) => {
    res.json({ message: 'Login API' });
});

router.post('/register', (req, res) => {
    res.json({ message: 'Register API' });
});

module.exports = router;
