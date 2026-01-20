const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// 1. Các route cho user đã đăng nhập (profile, đổi pass)
// Phải đặt TRƯỚC các route có tham số :id để tránh bị nhầm lẫn
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.put("/change-password", protect, userController.changeUserPassword);

// 2. Các route quản lý User (Chỉ Admin mới được truy cập)
// Áp dụng middleware protect và admin cho các route bên dưới
router.use(protect, admin);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
