const express = require('express');
const router = express.Router();

// Import models
const { Slideshow } = require('../models');

// GET /api/slideshows/public - Lấy các slideshow công khai từ database
router.get('/public', async (req, res) => {
    try {
        const slideshows = await Slideshow.findAll({
            where: { trang_thai: true },
            order: [['thu_tu_hien_thi', 'ASC']],
            attributes: ['id', 'image_url', 'tieu_de', 'phu_de', 'link_to', 'thu_tu_hien_thi', 'trang_thai']
        });
        
        res.json(slideshows);
    } catch (error) {
        console.error('Lỗi slideshow:', error);
        res.status(500).json({ error: 'Lỗi khi lấy slideshow', chi_tiet: error.message });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Các route cho slideshow' });
});

module.exports = router;
