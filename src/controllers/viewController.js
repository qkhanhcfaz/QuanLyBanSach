// File: /src/controllers/viewController.js

const { Op } = require('sequelize');
const db = require('../models');

const { Product, Category, Slideshow, Review, User } = db;

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
    // 1) Slideshow
    let slides = [];
    try {
      slides = await Slideshow.findAll({
        where: { trang_thai: true },
        order: [['thu_tu_hien_thi', 'ASC']],
      });
    } catch (e) {
      // nếu chưa có bảng/Model slideshow thì vẫn render trang chủ được
      slides = [];
    }

    // 2) Sách mới (8)
    const newProducts = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }],
    });

    // 3) Nổi bật / Best sellers (tạm thời lấy mới nhất)
    const bestSellers = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }],
    });

    // 4) Sách theo danh mục nổi bật (đổi ID này theo DB của bạn)
    const featuredCategoryId = 4;
    const featuredCategoryProducts = await Product.findAll({
      where: { danh_muc_id: featuredCategoryId },
      limit: 4,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }],
    });

    return res.render('pages/home', {
      title: 'Trang Chủ - Nhà Sách',
      slides,
      newProducts,
      bestSellers,
      featuredCategoryProducts,
      user: req.user,
    });
  } catch (error) {
    console.error('Lỗi trang chủ:', error);
    return res.status(500).render('pages/error', { message: 'Lỗi tải trang chủ', user: req.user });
  }
};

/**
 * @description     Render Danh sách Sản phẩm
 * @route           GET /products
 */
const renderProductListPage = async (req, res) => {
  try {
    const page = clampMin(toInt(req.query.page, 1), 1);
    const limit = 12;
    const offset = (page - 1) * limit;

    const category = req.query.category ? toInt(req.query.category, 0) : null;
    const keyword = (req.query.keyword || '').trim();
    const sortByRaw = (req.query.sortBy || 'createdAt').trim();
    const orderRaw = (req.query.order || 'DESC').toUpperCase();

    // chống sort bậy gây lỗi / injection
    const allowedSortFields = ['createdAt', 'ten_sach', 'gia_ban'];
    const sortBy = allowedSortFields.includes(sortByRaw) ? sortByRaw : 'createdAt';
    const order = orderRaw === 'ASC' ? 'ASC' : 'DESC';

    const where = {};
    if (category && Number.isFinite(category) && category > 0) where.danh_muc_id = category;
    if (keyword) where.ten_sach = { [Op.iLike]: `%${keyword}%` };

    // sidebar danh mục
    const allCategories = await Category.findAll({ order: [['ten_danh_muc', 'ASC']] });

    let currentCategoryInfo = null;
    if (category && category > 0) {
      currentCategoryInfo = allCategories.find((c) => String(c.id) === String(category)) || null;
    }

    const { rows: products, count: totalProducts } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }],
    });

    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

    return res.render('pages/products', {
      title: currentCategoryInfo?.ten_danh_muc || 'Sản Phẩm',
      currentCategory: currentCategoryInfo,
      allCategories,
      queryParams: req.query || {},
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
      user: req.user,
    });
  } catch (error) {
    console.error('Lỗi trang danh sách sản phẩm:', error);
    return res.status(500).render('pages/error', { message: 'Lỗi tải danh sách sản phẩm', user: req.user });
  }
};

/**
 * @description     Render Chi tiết Sản phẩm
 * @route           GET /products/:id
 */
const renderProductDetailPage = async (req, res) => {
  try {
    const id = toInt(req.params.id, NaN);

    // check id hợp lệ
    if (!Number.isFinite(id)) {
      return res.status(404).render('pages/error', { message: 'Đường dẫn sản phẩm không hợp lệ', user: req.user });
    }

    // 1) sản phẩm
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).render('pages/error', { message: 'Sản phẩm không tồn tại', user: req.user });
    }

    // 2) reviews (tự dò tên field product_id / san_pham_id nếu có)
    let reviews = [];
    try {
      const productFk =
        (Review?.rawAttributes?.product_id && 'product_id') ||
        (Review?.rawAttributes?.san_pham_id && 'san_pham_id') ||
        'product_id';

      reviews = await Review.findAll({
        where: { [productFk]: id },
        include: [{ model: User, as: 'user', attributes: ['ho_ten'] }],
        order: [['createdAt', 'DESC']],
      });
    } catch (err) {
      // không có bảng review hoặc association user chưa đúng -> để rỗng
      reviews = [];
    }

    // 3) sản phẩm liên quan
    const relatedProducts = await Product.findAll({
      where: {
        danh_muc_id: product.danh_muc_id,
        id: { [Op.ne]: product.id },
      },
      limit: 4,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }],
    });

    return res.render('pages/product-detail', {
      title: product.ten_sach || 'Chi Tiết Sản Phẩm',
      product,
      reviews,
      relatedProducts,
      user: req.user,
    });
  } catch (error) {
    console.error('Lỗi chi tiết sản phẩm:', error);
    return res.status(500).render('pages/error', { message: 'Lỗi server khi tải sản phẩm', user: req.user });
  }
};

// --- Các trang tĩnh / Auth ---

const renderLoginPage = (req, res) => {
  res.render('pages/login', { title: 'Đăng Nhập', user: req.user });
};

const renderRegisterPage = (req, res) => {
  res.render('pages/register', { title: 'Đăng Ký', user: req.user });
};

const renderCartPage = (req, res) => {
  res.render('pages/cart', { title: 'Giỏ Hàng', user: req.user });
};

const renderCheckoutPage = (req, res) => {
  res.render('pages/checkout', { title: 'Thanh Toán', user: req.user });
};

const renderMyOrdersPage = (req, res) => {
  res.render('pages/my-orders', { title: 'Đơn Hàng Của Tôi', user: req.user });
};

const renderOrderDetailPage = (req, res) => {
  res.render('pages/order-detail', {
    title: 'Chi tiết đơn hàng',
    orderId: req.params.id,
    user: req.user,
  });
};

const renderProfilePage = (req, res) => {
  res.render('pages/profile', { title: 'Hồ Sơ', user: req.user });
};

const renderForgotPasswordPage = (req, res) => {
  res.render('pages/forgot-password', { title: 'Quên Mật Khẩu', user: req.user });
};

const renderResetPasswordPage = (req, res) => {
  res.render('pages/reset-password', { title: 'Đặt Lại Mật Khẩu', user: req.user });
};

// Export (giữ đúng tên hàm để routes không bị gãy)
exports.renderHomePage = renderHomePage;
exports.renderProductListPage = renderProductListPage;
exports.renderProductDetailPage = renderProductDetailPage;

exports.renderLoginPage = renderLoginPage;
exports.renderRegisterPage = renderRegisterPage;

exports.renderCartPage = renderCartPage;
exports.renderCheckoutPage = renderCheckoutPage;

exports.renderMyOrdersPage = renderMyOrdersPage;
exports.renderOrderDetailPage = renderOrderDetailPage;

exports.renderProfilePage = renderProfilePage;
exports.renderForgotPasswordPage = renderForgotPasswordPage;
exports.renderResetPasswordPage = renderResetPasswordPage;
