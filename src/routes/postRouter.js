const express = require('express');
const router = express.Router();

// GET /api/posts/public - Lấy các bài viết công khai
router.get('/public', async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        
        // TODO: Khi model được import, thay đổi để lấy từ database
        // const posts = await Post.findAll({ where: { trang_thai: true }, limit: parseInt(limit), order: [['createdAt', 'DESC']] });
        
        // Mock data để trả về
        const posts = [
            {
                id: 1,
                tieu_de: 'Cách chọn cuốn sách phù hợp cho bạn',
                slug: 'cach-chon-cuon-sach-phu-hop',
                anh_dai_dien: '/images/post1.jpg',
                noi_dung_ngan: 'Tìm hiểu cách lựa chọn cuốn sách phù hợp với sở thích của bạn...',
                trang_thai: true
            },
            {
                id: 2,
                tieu_de: 'Top 10 cuốn sách hay nhất năm 2025',
                slug: 'top-10-cuon-sach-hay-2025',
                anh_dai_dien: '/images/post2.jpg',
                noi_dung_ngan: 'Danh sách các cuốn sách được đánh giá cao nhất trong năm...',
                trang_thai: true
            },
            {
                id: 3,
                tieu_de: 'Lợi ích của việc đọc sách hàng ngày',
                slug: 'loi-ich-doc-sach-hang-ngay',
                anh_dai_dien: '/images/post3.jpg',
                noi_dung_ngan: 'Khám phá các lợi ích tuyệt vời của việc duy trì thói quen đọc sách...',
                trang_thai: true
            }
        ];
        
        res.json(posts.slice(0, parseInt(limit)));
    } catch (error) {
        console.error('Lỗi bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bài viết', chi_tiet: error.message });
    }
});

router.get('/', (req, res) => {
    res.json({ message: 'Các route cho bài viết' });
});

module.exports = router;
