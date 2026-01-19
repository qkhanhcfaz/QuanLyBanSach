const express = require('express');
const router = express.Router();

// Import models
const { Post } = require('../models');

// GET /api/posts/public - Lấy các bài viết công khai từ database
router.get('/public', async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        
        const posts = await Post.findAll({
            where: { trang_thai: true },
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'tieu_de', 'slug', 'anh_dai_dien', 'noi_dung_ngan']
        });
        
        res.json(posts);
    } catch (error) {
        console.error('Lỗi bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bài viết', chi_tiet: error.message });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Các route cho bài viết' });
});

module.exports = router;
