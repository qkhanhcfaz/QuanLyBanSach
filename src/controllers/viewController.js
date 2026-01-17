// File: /src/controllers/viewController.js
const { Op } = require("sequelize");
// [QUAN TRỌNG] Thêm 'Review' vào danh sách import
const {
  Product,
  Category,
  Slideshow,
  Order,
  OrderItem,
  User,
  Review,
  Post,
  Favorite,
} = require("../models");

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

    res.render("pages/home", {
      title: "Trang Chủ",
      slides,
      newProducts,
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
      return res
        .status(404)
        .render("pages/error", { message: "Sản phẩm không tồn tại" });
    }

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

    // 4. [CODE MỚI] Đếm số lượt yêu thích
    let favoriteCount = 0;
    try {
      favoriteCount = await Favorite.count({ where: { product_id: id } });
    } catch (err) {
      console.warn(
        "Chưa thể đếm lượt thích (có thể do thiếu bảng Favorites), bỏ qua.",
      );
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

    // 6. Render và TRUYỀN ĐỦ BIẾN
    res.render("pages/product-detail", {
      title: product.ten_sach,
      product: product,
      reviews: reviews,
      relatedProducts: relatedProducts,
      favoriteCount: favoriteCount,
      avgRating: avgRating, // <--- Đã thêm biến này
      user: req.user,
    });
  } catch (error) {
    console.error("Lỗi chi tiết sản phẩm:", error);
    res
      .status(500)
      .render("pages/error", { message: "Lỗi server khi tải sản phẩm" });
  }
};

/**
 * Render Trang Tin Tức (Blog)
 */
const renderBlogPage = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { trang_thai: true },
      order: [["createdAt", "DESC"]],
    });

    res.render("pages/blog", {
      title: "Tin Tức & Sự Kiện",
      posts,
      user: req.user,
    });
  } catch (error) {
    console.error("Lỗi trang tin tức:", error);
    res.render("pages/error", { message: "Lỗi tải danh sách bài viết" });
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
  renderForgotPasswordPage,
  renderResetPasswordPage,
  renderBlogPage,
};
