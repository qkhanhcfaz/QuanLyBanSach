// File: /src/controllers/adminViewController.js
// Bộ điều khiển (Controller) để render các trang giao diện Admin

/**
 * Render trang Dashboard
 */
const renderAdminDashboard = (req, res) => {
    res.render('admin/pages/dashboard', { title: 'Admin Dashboard' });
};

/**
 * Render trang Quản lý Sản phẩm
 */
const renderAdminProducts = (req, res) => {
    res.render('admin/pages/products', { title: 'Admin Products' });
};

/**
 * Render trang Form Thêm/Sửa Sản phẩm
 */
const renderProductFormPage = (req, res) => {
    const productId = req.params.id;
    const isEdit = !!productId;
    res.render('admin/pages/product-form', { 
        title: isEdit ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm',
        product: null
    });
};

/**
 * Render trang Quản lý Danh mục
 */
const renderAdminCategoriesPage = (req, res) => {
    res.render('admin/pages/categories', { title: 'Admin Categories' });
};

/**
 * Render trang Quản lý Đơn hàng
 */
const renderAdminOrdersPage = (req, res) => {
    res.render('admin/pages/orders', { title: 'Admin Orders' });
};

/**
 * Render trang Chi tiết Đơn hàng
 */
const renderAdminOrderDetailPage = (req, res) => {
    const orderId = req.params.id;
    res.render('admin/pages/order-detail', { 
        title: `Chi tiết Đơn hàng #${orderId}`,
        orderId
    });
};

/**
 * Render trang Quản lý Người dùng
 */
const renderAdminUsersPage = (req, res) => {
    res.render('admin/pages/users', { title: 'Admin Users' });
};

/**
 * Render trang Danh sách Nhập hàng
 */
const renderReceiptsListPage = (req, res) => {
    res.render('admin/pages/receipts', { title: 'Admin Receipts' });
};

/**
 * Render trang Chi tiết Nhập hàng
 */
const renderReceiptDetailPage = (req, res) => {
    const receiptId = req.params.id;
    res.render('admin/pages/receipt-detail', { 
        title: `Chi tiết Nhập hàng #${receiptId}`,
        receiptId
    });
};

/**
 * Render trang Quản lý Khuyến mãi
 */
const renderAdminPromotionsPage = (req, res) => {
    res.render('admin/pages/promotions', { title: 'Admin Promotions' });
};

/**
 * Render trang Form Thêm/Sửa Khuyến mãi
 */
const renderPromotionFormPage = (req, res) => {
    const promotionId = req.params.id;
    const isEdit = !!promotionId;
    res.render('admin/pages/promotion-form', { 
        title: isEdit ? 'Sửa Khuyến mãi' : 'Thêm Khuyến mãi',
        promotion: null
    });
};

// Export tất cả các hàm
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
    renderPromotionFormPage
};
