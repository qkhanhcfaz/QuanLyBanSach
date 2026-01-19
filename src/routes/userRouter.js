// File: /src/routes/userRouter.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Profile Routes (User bình thường có thể truy cập)
router.get("/profile", protect, userController.getUserProfile);
router.put("/profile", protect, userController.updateUserProfile);
router.put("/change-password", protect, userController.changeUserPassword);

// --- Admin Routes (Chỉ Admin mới được truy cập) ---
// Áp dụng middleware bảo vệ cho tất cả các route bên dưới
router.use(protect, admin);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUserByAdmin);
router.put("/:id", userController.updateUserByAdmin);
router.delete("/:id", userController.deleteUser);

module.exports = router;
