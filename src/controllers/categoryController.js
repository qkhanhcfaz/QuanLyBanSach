const { Category } = require("../models");

// GET /api/categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "ten_danh_muc", "mo_ta", "danh_muc_cha_id", "img"],
      order: [["id", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error("Lỗi danh mục:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh mục", chi_tiet: error.message });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { ten_danh_muc, mo_ta, danh_muc_cha_id, img } = req.body;

    if (!ten_danh_muc) {
      return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
    }

    const newCategory = await Category.create({
      ten_danh_muc,
      mo_ta,
      danh_muc_cha_id: danh_muc_cha_id || null,
      img,
    });

    res
      .status(201)
      .json({ message: "Tạo danh mục thành công", category: newCategory });
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({ message: "Lỗi server khi tạo danh mục" });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_danh_muc, mo_ta, danh_muc_cha_id, img } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    category.ten_danh_muc = ten_danh_muc || category.ten_danh_muc;
    category.mo_ta = mo_ta !== undefined ? mo_ta : category.mo_ta;

    // Handle logic null for danh_muc_cha_id if sent as null/empty
    if (danh_muc_cha_id === null || danh_muc_cha_id === "") {
      category.danh_muc_cha_id = null;
    } else {
      category.danh_muc_cha_id = danh_muc_cha_id;
    }

    category.img = img !== undefined ? img : category.img;

    await category.save();

    res.json({ message: "Cập nhật danh mục thành công", category });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật danh mục" });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
