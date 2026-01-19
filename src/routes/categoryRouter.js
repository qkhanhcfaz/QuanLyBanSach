const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middlewares/authMiddleware");

// GET /api/categories - Lấy tất cả danh mục
router.get("/", getAllCategories);

// POST /api/categories - Tạo danh mục mới (chỉ admin)
router.post("/", protect, admin, createCategory);

// PUT /api/categories/:id - Cập nhật danh mục (chỉ admin)
router.put("/:id", protect, admin, updateCategory);

// DELETE /api/categories/:id - Xóa danh mục (chỉ admin)
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
