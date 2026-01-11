const express = require('express');
const router = express.Router();

// GET /api/products/bestsellers - Lấy sản phẩm bán chạy nhất
router.get('/bestsellers', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        // TODO: Khi model được import, implement logic thực tế
        // const bestsellers = await Product.findAll({ limit: parseInt(limit), order: [['sales', 'DESC']] });
        
        // Mock data để trả về
        const bestsellers = [
            {
                id: 1,
                ten_sach: 'Lập trình JavaScript cơ bản',
                tac_gia: 'Nguyễn A',
                gia_bia: 350000,
                img: '/images/product1.jpg',
                mo_ta_ngan: 'Cuốn sách bán chạy nhất về lập trình'
            },
            {
                id: 2,
                ten_sach: 'Kinh tế học nhập môn',
                tac_gia: 'Trần B',
                gia_bia: 280000,
                img: '/images/product2.jpg',
                mo_ta_ngan: 'Cuốn sách bán chạy về kinh tế'
            }
        ];
        
        res.json(bestsellers.slice(0, parseInt(limit)));
    } catch (error) {
        console.error('Lỗi sản phẩm bán chạy:', error);
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm bán chạy', chi_tiet: error.message });
    }
});

// GET /api/products - Lấy danh sách sản phẩm (hỗ trợ query params)
router.get('/', async (req, res) => {
    try {
        // TODO: Khi model được import, implement logic thực tế
        // const { limit = 10, offset = 0, sortBy = 'id', order = 'ASC' } = req.query;
        // const products = await Product.findAll({ limit: parseInt(limit), offset: parseInt(offset) });
        
        // Mock data để trả về
        const products = [
            {
                id: 1,
                ten_sach: 'Lập trình JavaScript cơ bản',
                tac_gia: 'Nguyễn A',
                gia_bia: 350000,
                img: '/images/product1.jpg',
                mo_ta_ngan: 'Cuốn sách hướng dẫn lập trình JavaScript từ cơ bản đến nâng cao'
            },
            {
                id: 2,
                ten_sach: 'Kinh tế học nhập môn',
                tac_gia: 'Trần B',
                gia_bia: 280000,
                img: '/images/product2.jpg',
                mo_ta_ngan: 'Giới thiệu các khái niệm cơ bản về kinh tế học'
            },
            {
                id: 3,
                ten_sach: 'Tiểu thuyết Chinh Phục Thế Giới',
                tac_gia: 'Phạm C',
                gia_bia: 199000,
                img: '/images/product3.jpg',
                mo_ta_ngan: 'Một tác phẩm văn học kinh điển'
            }
        ];
        
        res.json({ products });
    } catch (error) {
        console.error('Lỗi sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm', chi_tiet: error.message });
    }
});

module.exports = router;
