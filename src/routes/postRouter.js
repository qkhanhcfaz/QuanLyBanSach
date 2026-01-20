const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  getPublicPosts,
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  getAllPostsAdmin,
} = require("../controllers/postController");

// Public Routes
router.get("/", getPublicPosts);
router.get("/:id", getPostDetail);

const upload = require("../middlewares/uploadMiddleware");

// Admin Routes (CRUD)
// Note: Route lấy danh sách cho admin có thể dùng chung getPublicPosts hoặc riêng getAllPostsAdmin
router.get("/admin/all", protect, admin, getAllPostsAdmin);
router.post("/", protect, admin, upload.single("hinh_anh"), createPost);
router.put("/:id", protect, admin, upload.single("hinh_anh"), updatePost);
router.delete("/:id", protect, admin, deletePost);

module.exports = router;
