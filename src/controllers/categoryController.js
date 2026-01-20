const { Category, Product } = require('../models');

// Tạo danh mục mới
const createCategory = async (req, res) => {
    try {
        const { ten_danh_muc, danh_muc_cha_id, mo_ta, img } = req.body;

        const newCategory = await Category.create({
            ten_danh_muc,
            danh_muc_cha_id: danh_muc_cha_id || null, // Nếu rỗng thì là null (danh mục gốc)
            mo_ta,
            img
        });

        res.status(201).json({
            message: 'Thêm danh mục thành công!',
            category: newCategory
        });
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm danh mục', error: error.message });
    }
};

// Cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { ten_danh_muc, danh_muc_cha_id, mo_ta, img } = req.body;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // Cập nhật thông tin
        category.ten_danh_muc = ten_danh_muc;
        category.danh_muc_cha_id = danh_muc_cha_id || null;
        category.mo_ta = mo_ta;
        category.img = img;

        await category.save();

        res.json({
            message: 'Cập nhật danh mục thành công!',
            category
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục', error: error.message });
    }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }

        // 1. Kiểm tra xem có danh mục con không?
        const childCount = await Category.count({ where: { danh_muc_cha_id: id } });
        if (childCount > 0) {
            return res.status(400).json({ message: 'Không thể xóa danh mục này vì còn chứa danh mục con.' });
        }

        // 2. Kiểm tra xem có sản phẩm thuộc danh mục này không?
        const productCount = await Product.count({ where: { danh_muc_id: id } });
        if (productCount > 0) {
            return res.status(400).json({ message: `Không thể xóa danh mục này vì còn chứa ${productCount} sản phẩm.` });
        }

        await category.destroy();

        res.json({ message: 'Xóa danh mục thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        // Kiểm tra lỗi Foreign Key constraint của Database (nếu check ở trên bị sót)
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: 'Không thể xóa danh mục này vì đang được sử dụng ở bảng khác.' });
        }
        res.status(500).json({ message: 'Lỗi server khi xóa danh mục', error: error.message });
    }
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory
};
