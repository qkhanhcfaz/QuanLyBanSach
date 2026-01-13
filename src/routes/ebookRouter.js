const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Ebook routes' });
});

module.exports = router;
