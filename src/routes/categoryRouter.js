const express = require('express');
const router = express.Router();

// GET /api/categories - Lấy tất cả danh mục
router.get('/', async (req, res) => {
    try {
        // TODO: Khi model được import, thay đổi để lấy từ database
        // const categories = await Category.findAll();
        
        // Mock data để trả về
        const categories = [
            { id: 1, ten_danh_muc: 'Sách Kinh Tế', mo_ta: 'Sách về kinh tế học', danh_muc_cha_id: null },
            { id: 2, ten_danh_muc: 'Sách Công Nghệ', mo_ta: 'Sách về lập trình và công nghệ', danh_muc_cha_id: null },
            { id: 3, ten_danh_muc: 'Sách Văn Học', mo_ta: 'Sách văn học và tiểu thuyết', danh_muc_cha_id: null }
        ];
        
        res.json(categories);
    } catch (error) {
        console.error('Lỗi danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh mục', chi_tiet: error.message });
    }
});

module.exports = router;
