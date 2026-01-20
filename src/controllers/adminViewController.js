// File: /src/controllers/adminViewController.js
// GIAI ĐOẠN 1: Code cơ bản - Hiển thị được dữ liệu là thành công
const db = require('../models');
const { Product, Category, Order, User, Receipt, ReceiptItem, Promotion, SiteSetting, Review, sequelize } = db;

/**
 * Render Dashboard
 */
const renderAdminDashboard = async (req, res) => {
    try {
        res.render('admin/pages/dashboard', {
            title: 'Dashboard',
            user: req.user,
            path: '/'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

/**
 * Render Danh sách Sản phẩm (CƠ BẢN)
 * - Chưa có lọc, chưa có sort động
 * - Lấy toàn bộ danh sách (ngây thơ)
 */
const { Op } = require('sequelize');

/**
 * Render Danh sách Sản phẩm (CÓ SEARCH, SORT, PAGINATION)
 */
const renderAdminProducts = async (req, res) => {
    try {
        const { keyword, page = 1, sortBy = 'createdAt', order = 'DESC' } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        if (keyword) {
            whereCondition.ten_sach = { [Op.iLike]: `%${keyword}%` };
        }

        const { count, rows } = await Product.findAndCountAll({
            where: whereCondition,
            include: [{ model: Category, as: 'category' }],
            order: [[sortBy, order]],
            limit,
            offset
        });

        res.render('admin/pages/products', {
            title: 'Quản lý Sản phẩm',
            user: req.user,
            path: '/products',
            products: rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalProducts: count,
            keyword,
            sortBy,
            order
        });
    } catch (error) {
        console.error("Lỗi tải sản phẩm admin:", error);
        res.status(500).send('Lỗi tải sản phẩm');
    }
};

/**
 * Render Form Sản phẩm
 */
const renderProductFormPage = async (req, res) => {
    try {
        const categories = await Category.findAll();
        let product = null;
        let title = 'Thêm Sản phẩm';

        if (req.params.id) {
            product = await Product.findByPk(req.params.id);
            title = 'Sửa Sản phẩm';
        }

        res.render('admin/pages/product-form', {
            title,
            user: req.user,
            path: '/products',
            categories,
            product
        });
    } catch (error) {
        res.redirect('/admin/products');
    }
};

/**
 * Render Danh mục
 */
const renderAdminCategoriesPage = async (req, res) => {
    try {
        res.render('admin/pages/categories', {
            title: 'Quản lý Danh mục',
            user: req.user,
            path: '/categories'
        });
    } catch (error) {
        res.status(500).send('Lỗi');
    }
};

/**
 * Render Danh sách Đơn hàng (CƠ BẢN)
 */
const renderAdminOrdersPage = async (req, res) => {
    try {
        res.render('admin/pages/orders', {
            title: 'Quản lý Đơn hàng',
            user: req.user,
            path: '/orders'
        });
    } catch (error) {
        res.status(500).send('Lỗi');
    }
};

/**
 * Render Chi tiết Đơn hàng
 */
const renderAdminOrderDetailPage = async (req, res) => {
    try {
        // Bắt buộc phải include đủ, nếu không View sẽ lỗi khi truy cập order.user.ho_ten
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user' },
                {
                    model: db.OrderItem,
                    as: 'orderItems',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!order) return res.status(404).send('Không tìm thấy đơn');

        res.render('admin/pages/order-detail', {
            title: `Đơn hàng #${order.id}`,
            user: req.user,
            path: '/orders',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

/**
 * Render User
 */
const renderAdminUsersPage = (req, res) => {
    res.render('admin/pages/users', {
        title: 'Quản lý Người dùng',
        user: req.user,
        path: '/users'
    });
};

/**
 * Render Phiếu nhập (CƠ BẢN)
 */
const renderReceiptsListPage = async (req, res) => {
    try {
        // Lấy hết phiếu nhập, chưa tìm kiếm
        const receipts = await Receipt.findAll({
            include: [{ model: User, as: 'creator' }],
            order: [['createdAt', 'DESC']]
        });

        res.render('admin/pages/receipts', {
            title: 'Quản lý Nhập hàng',
            user: req.user,
            path: '/receipts',
            receipts: receipts,
            currentPage: 1,
            totalPages: 1,
            keyword: ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi');
    }
};

/**
 * Render Chi tiết Phiếu nhập
 */
const renderReceiptDetailPage = async (req, res) => {
    try {
        const receipt = await Receipt.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator' },
                {
                    model: ReceiptItem,
                    as: 'receiptItems',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!receipt) return res.status(404).send('Không tìm thấy');

        res.render('admin/pages/receipt-detail', {
            title: `Phiếu nhập #${receipt.id}`,
            user: req.user,
            path: '/receipts',
            receipt
        });
    } catch (error) {
        res.status(500).send('Lỗi');
    }
};

/**
 * Render Khuyến mãi
 */
const renderAdminPromotionsPage = (req, res) => {
    res.render('admin/pages/promotions', {
        title: 'Quản lý Khuyến mãi',
        user: req.user,
        path: '/promotions'
    });
};

/**
 * Render Form Khuyến mãi
 */
const renderPromotionFormPage = async (req, res) => {
    try {
        let promotion = null;
        let title = 'Thêm Khuyến mãi';

        if (req.params.id) {
            promotion = await Promotion.findByPk(req.params.id);
            title = 'Sửa Khuyến mãi';
        }

        const products = await Product.findAll();
        const categories = await Category.findAll();

        res.render('admin/pages/promotion-form', {
            title,
            user: req.user,
            promotion,
            products,
            categories,
            path: '/promotions'
        });
    } catch (error) {

        res.redirect('/admin/promotions');
    }
};

/**
 * Render Cấu hình Website
 */
const renderSiteSettings = async (req, res) => {
    try {
        let site = await SiteSetting.findOne();
        if (!site) {
            site = await SiteSetting.create({
                ten_website: 'BookZone',
                dia_chi: 'Quận 7, TP. Hồ Chí Minh',
                email: 'bookzonestore07@gmail.com',
                so_dien_thoai: '0969 671 344',
                nam_ban_quyen: 2026
            });
        }

        res.render('admin/pages/site-settings', {
            title: 'Cấu hình Website',
            user: req.user,
            site,
            path: '/settings'
        });
    } catch (error) {
        console.error("Render Settings Error:", error);
        res.status(500).send('Lỗi tải cấu hình');
    }
};

/**
 * Update Cấu hình Website
 */
const updateSiteSettings = async (req, res) => {
    try {
        const {
            ten_website, dia_chi, email, so_dien_thoai, nam_ban_quyen,
            facebook, instagram, twitter, linkedin,
            mo_ta // <--- Thêm nhận mo_ta từ form
        } = req.body;

        let site = await SiteSetting.findOne();
        if (!site) {
            site = new SiteSetting();
        }

        site.ten_website = ten_website;
        site.dia_chi = dia_chi;
        site.email = email;
        site.so_dien_thoai = so_dien_thoai;
        site.nam_ban_quyen = nam_ban_quyen || 2026;
        site.mo_ta = mo_ta; // <--- Lưu vào DB

        site.facebook = facebook;
        site.instagram = instagram;
        site.twitter = twitter;
        site.linkedin = linkedin;

        await site.save();

        res.redirect('/admin/settings?status=success');
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).send('Lỗi cập nhật cấu hình');
    }
};

/**
 * Render Thống kê Doanh thu
 */
const renderRevenueStatisticsPage = (req, res) => {
    res.render('admin/pages/statistics-revenue', {
        title: 'Thống kê Doanh thu',
        user: req.user,
        path: '/statistics/revenue'
    });
};

/**
 * Render Thống kê Đơn hàng
 */
const renderOrderStatisticsPage = (req, res) => {
    res.render('admin/pages/statistics-orders', {
        title: 'Thống kê Đơn hàng',
        user: req.user,
        path: '/statistics/orders'
    });
};

/**
 * Render Danh sách Đánh giá
 */
const renderAdminReviewsPage = async (req, res) => {
    try {
        const { page = 1, keyword, productId, rating, date, sortBy = 'createdAt', order = 'DESC' } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const whereCondition = {};
        const userWhere = {};
        const productWhere = {};

        if (keyword) {
            whereCondition[Op.or] = [
                { '$user.ho_ten$': { [Op.iLike]: `%${keyword}%` } },
                { '$product.ten_sach$': { [Op.iLike]: `%${keyword}%` } }
            ];
        }

        if (productId) {
            whereCondition.product_id = productId;
        }

        if (rating) {
            whereCondition.rating = rating;
        }

        if (date) {
            whereCondition.createdAt = {
                [Op.and]: [
                    sequelize.where(sequelize.fn('DATE', sequelize.col('Review.createdAt')), '=', date)
                ]
            };
        }

        const { count, rows } = await Review.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'user', attributes: ['ho_ten', 'email'], where: userWhere, required: false },
                { model: Product, as: 'product', attributes: ['id', 'ten_sach', 'img'], where: productWhere, required: false }
            ],
            order: [[sortBy, order]],
            limit,
            offset,
            subQuery: false // Important when filtering by included model fields
        });

        // Lấy danh sách sản phẩm để filter dropdown
        const products = await Product.findAll({
            attributes: ['id', 'ten_sach'],
            order: [['ten_sach', 'ASC']]
        });

        res.render('admin/pages/reviews', {
            title: 'Quản lý Đánh giá',
            user: req.user,
            path: '/reviews',
            reviews: rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalReviews: count,
            products,
            // Query params để giữ trạng thái form
            keyword,
            productId,
            rating,
            date,
            sortBy,
            order
        });
    } catch (error) {
        console.error("Lỗi tải đánh giá admin:", error);
        res.status(500).send('Lỗi tải đánh giá');
    }
};

/**
 * Render Thống kê Sản phẩm bán chạy
 */
const renderBestSellingStatisticsPage = (req, res) => {
    res.render('admin/pages/statistics-best-selling', {
        title: 'Sản phẩm bán chạy',
        user: req.user,
        path: '/statistics/best-selling'
    });
};

module.exports = {
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
    renderAdminReviewsPage,
    renderBestSellingStatisticsPage
};
