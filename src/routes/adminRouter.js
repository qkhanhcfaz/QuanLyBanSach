// File: /src/routes/adminRouter.js (Phiên bản cuối cùng)

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // [NEW] Import multer
const {
  renderAdminDashboard,
  renderAdminProducts,
  renderProductFormPage,
  renderAdminCategoriesPage,
  renderAdminOrdersPage,
  renderAdminOrderDetailPage,
  renderAdminUsersPage,
  renderReceiptsListPage,
  renderReceiptDetailPage,
  renderAdminPromotionsPage,
  renderPromotionFormPage,
  renderSiteSettings,
  updateSiteSettings,
  renderRevenueStatisticsPage,
  renderOrderStatisticsPage,
  renderBestSellingStatisticsPage,
  renderAdminContactsPage,
  renderAdminPostsPage,
  renderPostFormPage,
  renderAdminReviewsPage,
  renderAdminSlideshowsPage, // [NEW]
  renderSlideshowFormPage, // [NEW]
} = require("../controllers/adminViewController");

// TẤT CẢ CÁC ROUTE TRONG FILE NÀY SẼ TỰ ĐỘNG CÓ TIỀN TỐ /admin
// (Do cách chúng ta sẽ cấu hình trong server.js)

// Dashboard
router.get("/", protect, admin, renderAdminDashboard);

// Thống kê
router.get("/statistics/revenue", protect, admin, renderRevenueStatisticsPage);
router.get("/statistics/orders", protect, admin, renderOrderStatisticsPage);
router.get(
  "/statistics/best-selling",
  protect,
  admin,
  renderBestSellingStatisticsPage,
);

// Quản lý Sản phẩm
router.get("/products", protect, admin, renderAdminProducts);
router.get("/products/add", protect, admin, renderProductFormPage);
router.get("/products/edit/:id", protect, admin, renderProductFormPage);

// Quản lý Danh mục
router.get("/categories", protect, admin, renderAdminCategoriesPage);

// Quản lý Đơn hàng
router.get("/orders", protect, admin, renderAdminOrdersPage);
router.get("/orders/:id", protect, admin, renderAdminOrderDetailPage);

// Quản lý Nhập hàng
router.get("/receipts", protect, admin, renderReceiptsListPage);
router.get("/receipts/:id", protect, admin, renderReceiptDetailPage);

// Quản lý Khuyến mãi
router.get("/promotions", protect, admin, renderAdminPromotionsPage);
router.get("/promotions/add", protect, admin, renderPromotionFormPage);
router.get("/promotions/edit/:id", protect, admin, renderPromotionFormPage);

// Quản lý Cấu hình Website
router.get("/settings", protect, admin, renderSiteSettings);
router.post("/settings", protect, admin, updateSiteSettings);

// Quản lý Người dùng
router.get("/users", protect, admin, renderAdminUsersPage);

// Quản lý Chat Support
const { renderAdminChatPage } = require("../controllers/chatController");
router.get("/chat", protect, admin, renderAdminChatPage);

// Quản lý Liên hệ
router.get("/contacts", protect, admin, renderAdminContactsPage);

// Quản lý Bài viết
router.get("/posts", protect, admin, renderAdminPostsPage);
router.get("/posts/add", protect, admin, renderPostFormPage);
router.get("/posts/edit/:id", protect, admin, renderPostFormPage);

// Quản lý Đánh giá
router.get("/reviews", protect, admin, renderAdminReviewsPage);

// Quản lý Slideshow
const {
  createSlideshow,
  updateSlideshow,
  deleteSlideshow,
} = require("../controllers/slideshowController");

router.get("/slideshows", protect, admin, renderAdminSlideshowsPage);
router.get("/slideshows/add", protect, admin, renderSlideshowFormPage);
router.get("/slideshows/edit/:id", protect, admin, renderSlideshowFormPage);

// CRUD
router.post(
  "/slideshows/add",
  protect,
  admin,
  upload.single("image"),
  createSlideshow,
);
router.post(
  "/slideshows/edit/:id",
  protect,
  admin,
  upload.single("image"),
  updateSlideshow,
);
router.get("/slideshows/delete/:id", protect, admin, deleteSlideshow);

module.exports = router;
