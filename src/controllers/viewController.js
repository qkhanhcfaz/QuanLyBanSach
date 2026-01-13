// File: /src/controllers/viewController.js
const { Op } = require('sequelize');
// Import các Model từ Sequelize
const { Product, Category, Slideshow, Order, OrderItem, User, Review } = require('../models');

/**
 * @description     Render Trang Chủ
 * @route           GET /
 */
const renderHomePage = async (req, res) => {
    try {
        // 1. Lấy Slideshow
        const slides = await Slideshow.findAll({
            where: { trang_thai: true },
            order: [['thu_tu_hien_thi', 'ASC']]
        });

        // 2. Lấy "Sách Mới Lên Kệ" (8 cuốn mới nhất)
        const newProducts = await Product.findAll({
            limit: 8,
            order: [['createdAt', 'DESC']],
            include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc'] }]
        });

        // 3. Lấy "Top Sách Bán Chạy" (Dựa trên cột da_ban mới thêm)
        const bestSellers = await Product.findAll({
            limit: 8,
            order: [['da_ban', 'DESC']], 
            include: [{ model: Category, as: 'category', attributes: ['ten_danh_muc'] }]
        });

        // 4. Lấy sách cho mục "Văn Học" (Danh mục ID = 1)
        const featuredCategoryProducts = await Product.findAll({
            where: { danh_muc_id: 4 }, 
            limit: 4,
            order: [['createdAt', 'DESC']]
        });

        res.render('pages/home', { 
            title: 'Trang Chủ - Nhà Sách',
            slides,
            newProducts,
            bestSellers,        
            featuredCategoryProducts, 
            user: req.user // Truyền thông tin user để hiển thị trên Header
        });
    } catch (error) {
        console.error("Lỗi trang chủ:", error);
        res.render('pages/error', { message: 'Lỗi tải trang chủ' });
    }
};

/**
 * @description     Render Danh sách Sản phẩm
 * @route           GET /products
 */
const renderProductListPage = async (req, res) => {
    try {
        const { page = 1, category, keyword, sortBy = 'createdAt', order = 'DESC' } = req.query;
        const limit = 12;
        const offset = (page - 1) * limit;

        let where = {};
        if (category) where.danh_muc_id = category;
        if (keyword) where.ten_sach = { [Op.iLike]: `%${keyword}%` };

        // Lấy thông tin danh mục hiện tại để hiển thị tiêu đề
        const allCategories = await Category.findAll();
        let currentCategoryInfo = null;
        if (category) {
            currentCategoryInfo = allCategories.find(c => c.id == category);
        }

        const { count, rows } = await Product.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortBy, order]],
            include: [{ model: Category, as: 'category' }]
        });

        res.render('pages/products', {
            title: currentCategoryInfo ? currentCategoryInfo.ten_danh_muc : 'Tất Cả Sản Phẩm',
            products: rows,
            allCategories,
            currentCategory: currentCategoryInfo,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                limit
            },
            queryParams: req.query,
            user: req.user
        });

    } catch (error) {
        console.error("Lỗi trang sản phẩm:", error);
        res.render('pages/error', { message: 'Không thể tải danh sách sản phẩm' });
    }
};

/**
 * @description     Render Chi tiết Sản phẩm (ĐÃ SỬA LỖI REVIEWS & ID)
 * @route           GET /products/:id
 */
const renderProductDetailPage = async (req, res) => {
    try {
        const { id } = req.params;

        // [QUAN TRỌNG] Kiểm tra ID phải là số để tránh lỗi Database crash
        if (!id || isNaN(id)) {
            return res.status(404).render('pages/error', { message: 'Đường dẫn sản phẩm không hợp lệ' });
        }

        // 1. Tìm sản phẩm
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });

        if (!product) {
            return res.status(404).render('pages/error', { message: 'Sản phẩm không tồn tại' });
        }

        // 2. Lấy danh sách đánh giá (Khắc phục lỗi reviews is not defined)
        let reviews = [];
        try {
            reviews = await Review.findAll({
                where: { product_id: id },
                include: [{ model: User, as: 'user', attributes: ['ho_ten'] }],
                order: [['createdAt', 'DESC']]
            });
        } catch (err) {
            console.warn("Chưa có bảng reviews hoặc lỗi lấy review, trả về rỗng.");
        }

        // 3. Lấy sản phẩm liên quan (cùng danh mục)
        const relatedProducts = await Product.findAll({
            where: { 
                danh_muc_id: product.danh_muc_id,
                id: { [Op.ne]: product.id } // Loại trừ chính nó
            },
            limit: 4
        });

        // 4. Render view
        res.render('pages/product-detail', {
            title: product.ten_sach,
            product: product,
            reviews: reviews, // <--- BIẾN QUAN TRỌNG NHẤT
            relatedProducts: relatedProducts,
            user: req.user
        });

    } catch (error) {
        console.error("Lỗi chi tiết sản phẩm:", error);
        res.status(500).render('pages/error', { message: 'Lỗi server khi tải sản phẩm' });
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
    res.render('pages/checkout', { title: 'Thanh toán', user: req.user });
};

const renderMyOrdersPage = (req, res) => {
    res.render('pages/my-orders', { title: 'Lịch Sử Đơn Hàng', user: req.user });
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
    res.render('pages/profile', { title: 'Thông Tin Tài Khoản', user: req.user });
};

const renderForgotPasswordPage = (req, res) => {
    res.render('pages/forgot-password', { title: 'Quên Mật Khẩu', user: req.user });
};

const renderResetPasswordPage = (req, res) => {
    res.render('pages/reset-password', { title: 'Đặt Lại Mật Khẩu', user: req.user });
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
    renderResetPasswordPage
};