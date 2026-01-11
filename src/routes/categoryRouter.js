const express = require('express');
const router = express.Router();

// Import models
const { Category } = require('../models');

// GET /api/categories - Lấy tất cả danh mục từ database
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'ten_danh_muc', 'mo_ta', 'danh_muc_cha_id']
        });
        
        res.json(categories);
    } catch (error) {
        console.error('Lỗi danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh mục', chi_tiet: error.message });
    }
});

module.exports = router;
