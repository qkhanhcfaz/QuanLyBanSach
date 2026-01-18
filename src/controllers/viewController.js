// File: /src/controllers/viewController.js

const { Op } = require('sequelize');
const db = require('../models');

const { Product, Category, Slideshow, Review, User, Favorite, Post } = db;
const { getMyFavoriteIds } = require('./favoriteController');

// Configuration for model relationships
const REVIEW_FOREIGN_KEY = 'product_id'; // Standard foreign key for Review model

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
    const favoriteProductIds = req.user ? await getMyFavoriteIds(req.user.id) : [];

    // 1. Slideshow
    let slides = [];
    try {
      slides = await Slideshow.findAll({
        where: { trang_thai: true },
        order: [['thu_tu_hien_thi', 'ASC']],
      });
    } catch (e) {
      console.warn("Slideshow table missing or empty", e.message);
      slides = [];
    }

    // 2. Sách Mới (8 cuốn)
    const newProducts = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc', 'id'] }]
    });

    // 3. Best Sellers (Logic tạm: lấy mới nhất)
    const bestSellers = await Product.findAll({
      limit: 8,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc', 'id'] }]
    });

    // 4. Danh mục nổi bật (ví dụ ID 4 - Văn Học)
    // Lưu ý: Cần đảm bảo ID = 4 tồn tại trong bảng Categories
    let featuredCategoryProducts = [];
    try {
      featuredCategoryProducts = await Product.findAll({
        where: { danh_muc_id: 4 },
        limit: 4,
        order: [['createdAt', 'DESC']],
        include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc', 'id'] }]
      });
    } catch (err) {
      console.warn("Featured category query failed", err.message);
    }

    res.render('pages/home', {
      title: 'Trang Chủ - Nhà Sách',
      slides,
      newProducts,
      bestSellers,
      featuredCategoryProducts,
      favoriteProductIds,
      user: req.user
    });

  } catch (error) {
    console.error("Lỗi trang chủ:", error);
    res.render('pages/error', { message: 'Lỗi tải trang chủ', user: req.user });
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
    const minPrice = toInt(req.query.minPrice, 0);
    const maxPrice = toInt(req.query.maxPrice, 0);

    const allowedSortFields = ['createdAt', 'ten_sach', 'gia_ban', 'gia_bia'];
    const sortBy = allowedSortFields.includes(sortByRaw) ? sortByRaw : 'createdAt';
    const order = orderRaw === 'ASC' ? 'ASC' : 'DESC';

    const where = {};
    if (category && category > 0) where.danh_muc_id = category;

    if (minPrice > 0 || maxPrice > 0) {
      where.gia_bia = {};
      if (minPrice > 0) where.gia_bia[Op.gte] = minPrice;
      if (maxPrice > 0) where.gia_bia[Op.lte] = maxPrice;
    }

    if (keyword) {
      where[Op.and] = [
        db.sequelize.where(
          db.sequelize.fn('unaccent', db.sequelize.col('ten_sach')),
          { [Op.iLike]: db.sequelize.fn('unaccent', `%${keyword}%`) }
        )
      ];
    }

    // sidebar danh mục
    const allCategories = await Category.findAll({ order: [['ten_danh_muc', 'ASC']] });

    let currentCategoryInfo = null;
    if (category && category > 0) {
      currentCategoryInfo = allCategories.find((c) => String(c.id) === String(category)) || null;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc', 'id'] }]
    });

    res.render('pages/products', {
      title: currentCategoryInfo ? currentCategoryInfo.ten_danh_muc : 'Tất Cả Sản Phẩm',
      products: rows,
      allCategories,
      currentCategory: currentCategoryInfo,
      favoriteProductIds: req.user ? await getMyFavoriteIds(req.user.id) : [],
      queryParams: req.query,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
        totalItems: count
      },
      user: req.user
    });

  } catch (error) {
    console.error("Lỗi trang danh sách sản phẩm:", error);
    res.render('pages/error', { message: 'Lỗi tải danh sách sản phẩm', user: req.user });
  }
};

/**
 * @description     Render Chi tiết Sản phẩm
 * @route           GET /products/:id
 */
const renderProductDetailPage = async (req, res) => {
  try {
    const id = toInt(req.params.id, NaN);

    if (!Number.isFinite(id)) {
      return res.status(404).render('pages/error', { message: 'Product not found', user: req.user });
    }

    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      return res.status(404).render('pages/error', { message: 'Product not found', user: req.user });
    }

    // 2) reviews
    let reviews = [];
    try {
      if (Review) {
        reviews = await Review.findAll({
          where: { [REVIEW_FOREIGN_KEY]: id },
          include: [{ model: User, as: 'user', attributes: ['ho_ten'] }],
          order: [['createdAt', 'DESC']],
        });
      }
    } catch (err) {
      console.warn("Lỗi lấy review:", err.message);
      reviews = [];
    }

    // 3) INCREMENT VIEW COUNT
    await product.increment('views');

    // 4) STATS: Favorite Count & Avg Rating
    const favoriteCount = await Favorite.count({ where: { product_id: id } });

    let avgRating = 0;
    if (reviews.length > 0) {
      const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
      avgRating = (totalStars / reviews.length).toFixed(1);
    }

    // 5) sản phẩm liên quan
    const relatedProducts = await Product.findAll({
      where: {
        danh_muc_id: product.danh_muc_id,
        id: { [Op.ne]: product.id }
      },
      limit: 4,
      order: [['createdAt', 'DESC']],
      include: [{ model: Category, as: 'category', attributes: ['id', 'ten_danh_muc'] }]
    });

    return res.render('pages/product-detail', {
      title: product.ten_sach || 'Product Detail',
      product,
      reviews,
      relatedProducts,
      favoriteCount,
      avgRating,
      favoriteProductIds: req.user ? await getMyFavoriteIds(req.user.id) : [],
      user: req.user
    });

  } catch (error) {
    console.error('Product detail error:', error);
    return res.status(500).render('pages/error', { message: 'Server error', user: req.user });
  }
};

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
  // Chỉ render khung, dữ liệu load bằng JS client hoặc update logic sau
  res.render('pages/order-detail', {
    title: 'Chi tiết đơn hàng',
    orderId: req.params.id,
    user: req.user
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

const renderAboutPage = (req, res) => {
  res.render('pages/about', { title: 'Về Chúng Tôi', user: req.user });
};

const renderRecruitmentPage = (req, res) => {
  res.render('pages/careers', { title: 'Tuyển Dụng', user: req.user });
};

const renderTermsPage = (req, res) => {
  res.render('pages/terms', { title: 'Điều Khoản', user: req.user });
};

const renderGuidePage = (req, res) => {
  res.render('pages/guide', { title: 'Hướng Dẫn Mua Hàng', user: req.user });
};

const renderReturnPolicyPage = (req, res) => {
  res.render('pages/return-policy', { title: 'Chính Sách Đổi Trả', user: req.user });
};

const renderFAQPage = (req, res) => {
  res.render('pages/faq', { title: 'Câu Hỏi Thường Gặp', user: req.user });
};

const renderFavoritesPage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }

    const userId = req.user.id;
    // Lấy danh sách yêu thích kèm thông tin sản phẩm
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'ten_sach', 'gia_bia', 'img']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const products = favorites.map(fav => fav.Product);
    const favoriteProductIds = products.map(p => p.id);

    res.render('pages/favorites', {
      title: 'Sách Yêu Thích',
      products,
      favoriteProductIds
    });

  } catch (error) {
    console.error('Render Favorites Page Error:', error);
    res.status(500).render('pages/error', {
      title: 'Lỗi Server',
      message: 'Đã có lỗi xảy ra khi tải danh sách yêu thích. Vui lòng thử lại sau.'
    });
  }
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
exports.renderFavoritesPage = renderFavoritesPage;
exports.renderAboutPage = renderAboutPage;
exports.renderRecruitmentPage = renderRecruitmentPage;
exports.renderTermsPage = renderTermsPage;
exports.renderGuidePage = renderGuidePage;
exports.renderReturnPolicyPage = renderReturnPolicyPage;
exports.renderContactPage = async (req, res) => {
    res.render('pages/contact', {
        title: 'Liên hệ',
        user: req.user,
        path: '/contact'
    });
};

/**
 * Render Trang Blog (Danh sách bài viết)
 */
exports.renderBlogPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const offset = (page - 1) * limit;
        const keyword = req.query.keyword || '';

        const whereClause = { trang_thai: true };
        if (keyword) {
            whereClause.tieu_de = { [Op.like]: `%${keyword}%` };
        }

        const { count, rows } = await Post.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'author', attributes: ['ho_ten'] }]
        });

        res.render('pages/blog', {
            title: 'Tin tức',
            user: req.user,
            path: '/blog',
            posts: rows,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            keyword
        });
    } catch (error) {
        console.error('Render Blog Error:', error);
        res.status(500).render('pages/error', { message: 'Lỗi tải bài viết' });
    }
};

/**
 * Render Chi tiết bài viết
 */
exports.renderBlogDetailPage = async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.id, trang_thai: true },
            include: [{ model: User, as: 'author', attributes: ['ho_ten'] }]
        });

        if (!post) return res.status(404).render('pages/error', { message: 'Bài viết không tồn tại' });

        res.render('pages/blog-detail', {
            title: post.tieu_de,
            user: req.user,
            path: '/blog',
            post
        });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Lỗi tải bài viết' });
    }
};

exports.renderFAQPage = renderFAQPage;
