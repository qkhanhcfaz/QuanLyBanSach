const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Province routes' });
});

module.exports = router;
