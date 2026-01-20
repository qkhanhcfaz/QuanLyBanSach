const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Import models
const { Category } = require('../models');

// GET /api/categories - Lấy tất cả danh mục từ database
router.get('/', async (req, res) => {
    try {
        const { sequelize } = require('../models');
        const categories = await Category.findAll({
            attributes: [
                'id',
                'ten_danh_muc',
                'mo_ta',
                'danh_muc_cha_id',
                'img',
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM products AS p
                        WHERE p.danh_muc_id = "Category".id
                        AND p.trang_thai = 1
                    )`),
                    'productCount'
                ]
            ],
            order: [['id', 'ASC']]
        });

        res.json(categories);
    } catch (error) {
        console.error('Lỗi danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh mục', chi_tiet: error.message });
    }
});

// POST /api/categories - Thêm danh mục mới (Admin only)
router.post('/', protect, admin, createCategory);

// PUT /api/categories/:id - Cập nhật danh mục (Admin only)
router.put('/:id', protect, admin, updateCategory);

// DELETE /api/categories/:id - Xóa danh mục (Admin only)
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
