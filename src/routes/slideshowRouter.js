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
        
        // Normalize image paths: nếu DB lưu chỉ tên file (ví dụ 'slider_item_2_image.png'),
        // chuyển thành đường dẫn tĩnh '/images/...' để client có thể tải được ảnh.
        const normalized = slideshows.map(s => {
            const obj = s && s.toJSON ? s.toJSON() : s;
            if (obj.image_url && !/^https?:\/\//i.test(obj.image_url) && !obj.image_url.startsWith('/')) {
                obj.image_url = '/images/' + obj.image_url;
            }
            return obj;
        });

        res.json(normalized);
    } catch (error) {
        console.error('Lỗi slideshow:', error);
        res.status(500).json({ error: 'Lỗi khi lấy slideshow', chi_tiet: error.message });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Các route cho slideshow' });
});

module.exports = router;
