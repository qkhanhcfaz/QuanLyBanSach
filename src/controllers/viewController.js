const { Op } = require("sequelize");
const db = require("../models");

const { Product, Category, Slideshow, Review, User, Favorite, Post } = db;
const { getMyFavoriteIds } = require("./favoriteController");

// Configuration for model relationships
const REVIEW_FOREIGN_KEY = "product_id"; // Standard foreign key for Review model

/** Helpers */
const toInt = (v, def = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

const clampMin = (n, min) => (n < min ? min : n);

/**
 * @description     Render Trang Chủ
 * @route           GET /
 */
const renderHomePage = async (req, res) => {
  try {
    const slides = await Slideshow.findAll({
      where: { trang_thai: true },
      order: [["thu_tu_hien_thi", "ASC"]],
    });

    const newProducts = await Product.findAll({
      limit: 8,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Category, as: "category", attributes: ["ten_danh_muc"] },
      ],
    });

    // 2. Lấy danh sách Top Bán Chạy Trong Tháng
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bestSellersData = await db.OrderItem.findAll({
      attributes: [
        "product_id",
        [
          db.sequelize.fn("SUM", db.sequelize.col("so_luong_dat")),
          "total_sold",
        ],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "ten_sach", "gia_bia", "img"],
        },
        {
          model: db.Order,
          as: "order",
          where: {
            createdAt: { [Op.gte]: startOfMonth },
            trang_thai_don_hang: { [Op.in]: ["delivered", "shipping"] },
          },
          attributes: [],
        },
      ],
      group: ["product_id", "product.id"],
      order: [
        [db.sequelize.fn("SUM", db.sequelize.col("so_luong_dat")), "DESC"],
      ],
      limit: 10,
      raw: true,
      nest: true,
    });

    // Nếu trong tháng chưa có đơn nào, fallback về top bán chạy toàn thời gian
    let bestSellers = bestSellersData.map((item) => item.product);

    if (bestSellers.length === 0) {
      const allTimeBestSellers = await Product.findAll({
        limit: 10,
        order: [["da_ban", "DESC"]],
        attributes: ["id", "ten_sach", "gia_bia", "img"],
      });
      bestSellers = allTimeBestSellers;
    }

    // 3. Lấy danh sách Danh Mục Nổi Bật (có kèm sản phẩm)
    const featuredCategories = await Category.findAll({
      where: { is_featured: true },
      include: [
        {
          model: Product,
          as: "products",
          limit: 6, // [UPDATED] Giới hạn 6 sản phẩm
          order: [["createdAt", "DESC"]], // Lấy sản phẩm mới nhất của danh mục đó
        },
      ],
      order: [["id", "ASC"]], // Hoặc sắp xếp theo thứ tự ưu tiên nếu có cột 'priority'
    });

    res.render("pages/home", {
      title: "Trang Chủ",
      slides,
      newProducts,
      bestSellers,
      featuredCategories, // Pass featured categories
      user: req.user,
    });
  } catch (error) {
    console.error("Lỗi trang chủ:", error);
    res.render("pages/error", { message: "Lỗi tải trang chủ" });
  }
};

/**
 * @description     Render Danh sách Sản phẩm
 * @route           GET /products
 */
const renderProductListPage = async (req, res) => {
  try {
    const {
      page = 1,
      category,
      keyword,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;

    let where = {};
    if (category) where.danh_muc_id = category;
    if (keyword) where.ten_sach = { [Op.iLike]: `%${keyword}%` };

    const allCategories = await Category.findAll();
    let currentCategoryInfo = null;
    if (category) {
      currentCategoryInfo = allCategories.find((c) => c.id == category);
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [{ model: Category, as: "category" }],
    });

    res.render("pages/products", {
      title: currentCategoryInfo
        ? currentCategoryInfo.ten_danh_muc
        : "Tất Cả Sản Phẩm",
      products: rows,
      allCategories,
      currentCategory: currentCategoryInfo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        limit,
      },
      queryParams: req.query,
      user: req.user,
    });
  } catch (error) {
    console.error("Lỗi trang sản phẩm:", error);
    res.render("pages/error", { message: "Không thể tải danh sách sản phẩm" });
  }
};

/**
 * @description     Render Chi tiết Sản phẩm
 * @route           GET /products/:id
 */
const renderProductDetailPage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm sản phẩm
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: "category" }],
    });

    if (!product) {
      // Redirect to product list if specific product is missing (e.g., ID 1 error)
      return res.redirect("/products?error=product_not_found");
    }

    // [LOGIC MỚI - FINAL]
    // Sử dụng Middleware trong server.js để tracking previousPath.

    const currentUrl = req.originalUrl;
    const previousUrl = req.session?.previousPath; // Được set bởi middleware toàn cục

    console.log("------- CHECK VIEW SESSION (FINAL) -------");
    console.log("Previous URL:", previousUrl);
    console.log("Current URL:", currentUrl);

    if (previousUrl === currentUrl) {
      console.log(">> RELOAD DETECTED (PREV == CURR) -> SKIP");
    } else {
      console.log(">> NAVIGATION DETECTED -> INCREMENT");
      await product.increment("views");
    }
    console.log("------------------------------------------");

    // 2. [CODE MỚI] Lấy danh sách đánh giá của sản phẩm này
    // Nếu chưa có bảng reviews thì nó sẽ trả về mảng rỗng [] -> Không bị lỗi nữa
    let reviews = [];
    try {
      reviews = await Review.findAll({
        where: { product_id: id },
        include: [{ model: User, as: "user", attributes: ["ho_ten"] }], // Lấy tên người review
        order: [["createdAt", "DESC"]],
      });
    } catch (err) {
      console.warn(
        "Chưa thể tải đánh giá (có thể do thiếu bảng Review), bỏ qua.",
      );
    }

    // 3. Lấy sản phẩm liên quan
    const relatedProducts = await Product.findAll({
      where: {
        danh_muc_id: product.danh_muc_id,
        id: { [Op.ne]: product.id },
      },
      limit: 4,
    });

    // 6) Check if user can review (Has purchased & Delivered > Reviewed)
    let canReview = false;
    let deliveredOrderCount = 0;
    if (req.user) {
      // Find orders that are delivered and contain this product
      deliveredOrderCount = await db.Order.count({
        where: {
          user_id: req.user.id,
          trang_thai_don_hang: "delivered",
        },
        include: [
          {
            model: db.OrderItem,
            as: "orderItems",
            where: { product_id: id },
          },
        ],
      });

      // Count existing reviews by this user for this product
      const existingReviewCount = await db.Review.count({
        where: {
          user_id: req.user.id,
          product_id: id,
        },
      });

      canReview = deliveredOrderCount > existingReviewCount;
    }

    // 5. Tính điểm đánh giá trung bình
    let avgRating = 0;
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      avgRating = (totalRating / reviews.length).toFixed(1);
    }

    return res.render("pages/product-detail", {
      title: product.ten_sach || "Product Detail",
      product,
      reviews,
      relatedProducts,
      favoriteCount: 0, // Fallback
      favoriteProductIds: req.user ? await getMyFavoriteIds(req.user.id) : [],
      user: req.user,
      canReview,
      avgRating,
      deliveredOrderCount: req.user ? deliveredOrderCount : 0,
    });
  } catch (error) {
    console.error("Lỗi chi tiết sản phẩm:", error);
    res
      .status(500)
      .render("pages/error", { message: "Lỗi server khi tải sản phẩm" });
  }
};

const renderLoginPage = (req, res) => {
  res.render("pages/login", { title: "Đăng Nhập", user: req.user });
};

const renderRegisterPage = (req, res) => {
  res.render("pages/register", { title: "Đăng Ký", user: req.user });
};

const renderCartPage = (req, res) => {
  res.render("pages/cart", { title: "Giỏ Hàng", user: req.user });
};

const renderCheckoutPage = (req, res) => {
  res.render("pages/checkout", { title: "Thanh toán", user: req.user });
};

const renderMyOrdersPage = (req, res) => {
  res.render("pages/my-orders", { title: "Lịch Sử Đơn Hàng", user: req.user });
};

const renderOrderDetailPage = (req, res) => {
  res.render("pages/order-detail", {
    title: "Chi tiết đơn hàng",
    user: req.user,
  });
};

const renderProfilePage = (req, res) => {
  res.render("pages/profile", { title: "Thông Tin Tài Khoản", user: req.user });
};

const renderForgotPasswordPage = (req, res) => {
  res.render("pages/forgot-password", {
    title: "Quên Mật Khẩu",
    user: req.user,
  });
};

const renderResetPasswordPage = (req, res) => {
  res.render("pages/reset-password", {
    title: "Đặt Lại Mật Khẩu",
    user: req.user,
  });
};

const renderRecruitmentPage = (req, res) => {
  res.render("pages/careers", { title: "Tuyển Dụng", user: req.user });
};

const renderTermsPage = (req, res) => {
  res.render("pages/terms", { title: "Điều Khoản", user: req.user });
};

const renderGuidePage = (req, res) => {
  res.render("pages/guide", { title: "Hướng Dẫn Mua Hàng", user: req.user });
};

const renderReturnPolicyPage = (req, res) => {
  res.render("pages/return-policy", {
    title: "Chính Sách Đổi Trả",
    user: req.user,
  });
};

const renderFAQPage = (req, res) => {
  res.render("pages/faq", { title: "Câu Hỏi Thường Gặp", user: req.user });
};

/**
 * Render Trang Tin Tức (Blog)
 */
const renderBlogPage = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 6;
    const offset = (page - 1) * limit;
    const keyword = req.query.keyword || "";

    const whereClause = { trang_thai: true };
    if (keyword) {
      whereClause.tieu_de = { [Op.like]: `%${keyword}%` };
    }

    const { count, rows } = await Post.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "author", attributes: ["ho_ten"] }],
    });

    res.render("pages/blog", {
      title: "Tin tức",
      user: req.user,
      path: "/blog",
      posts: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      keyword,
    });
  } catch (error) {
    console.error("Render Blog Error:", error);
    res.status(500).render("pages/error", { message: "Lỗi tải bài viết" });
  }
};

/**
 * Render Chi tiết bài viết
 */
const renderBlogDetailPage = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, trang_thai: true },
      include: [{ model: User, as: "author", attributes: ["ho_ten"] }],
    });

    if (!post)
      return res
        .status(404)
        .render("pages/error", { message: "Bài viết không tồn tại" });

    res.render("pages/blog-detail", {
      title: post.tieu_de,
      user: req.user,
      path: "/blog",
      post,
    });
  } catch (error) {
    res.status(500).render("pages/error", { message: "Lỗi tải bài viết" });
  }
};

const renderFavoritesPage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const userId = req.user.id;
    // Lấy danh sách yêu thích kèm thông tin sản phẩm
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ["id", "ten_sach", "gia_bia", "img"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const products = favorites.map((fav) => fav.Product);
    const favoriteProductIds = products.map((p) => p.id);

    res.render("pages/favorites", {
      title: "Sách Yêu Thích",
      products,
      favoriteProductIds,
    });
  } catch (error) {
    console.error("Render Favorites Page Error:", error);
    res.status(500).render("pages/error", {
      title: "Lỗi Server",
      message:
        "Đã có lỗi xảy ra khi tải danh sách yêu thích. Vui lòng thử lại sau.",
    });
  }
};

const renderAboutPage = (req, res) => {
  // Dummy function as it was missing from original snippet but exported
  res.render("pages/about", { title: "Giới Thiệu", user: req.user });
};

const renderContactPage = async (req, res) => {
  res.render("pages/contact", {
    title: "Liên hệ",
    user: req.user,
    path: "/contact",
  });
};

// Export (giữ đúng tên hàm để routes không bị gãy)
module.exports = {
  renderHomePage,
  renderProductListPage,
  renderProductDetailPage,
  renderLoginPage,
  renderRegisterPage,
  renderCartPage,
  renderCheckoutPage,
  renderMyOrdersPage,
  renderOrderDetailPage,
  renderProfilePage,
  renderForgotPasswordPage,
  renderResetPasswordPage,
  renderFavoritesPage,
  renderAboutPage,
  renderRecruitmentPage,
  renderTermsPage,
  renderGuidePage,
  renderReturnPolicyPage,
  renderFAQPage,
  renderContactPage,
  renderBlogPage,
  renderBlogDetailPage,
};
