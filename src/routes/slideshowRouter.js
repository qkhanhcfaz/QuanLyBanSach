const express = require('express');
const router = express.Router();

// GET /api/slideshows/public - Lấy các slideshow công khai
router.get('/public', async (req, res) => {
    try {
        // TODO: Khi model được import, thay đổi để lấy từ database
        // const slideshows = await Slideshow.findAll({ where: { trang_thai: true }, order: [['thu_tu_hien_thi', 'ASC']] });
        
        // Mock data để trả về
        const slideshows = [
            {
                id: 1,
                image_url: '/images/banner1.jpg',
                tieu_de: 'Khuyến mãi sách mùa hè',
                phu_de: 'Giảm giá 50% tất cả sách',
                link_to: '/products',
                thu_tu_hien_thi: 1,
                trang_thai: true
            },
            {
                id: 2,
                image_url: '/images/banner2.jpg',
                tieu_de: 'Sách mới của tháng',
                phu_de: 'Khám phá những cuốn sách mới nhất',
                link_to: '/products?sortBy=createdAt',
                thu_tu_hien_thi: 2,
                trang_thai: true
            }
        ];
        
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
