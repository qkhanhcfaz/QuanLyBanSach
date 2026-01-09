// View Controller - Xử lý render các trang view

// Render trang chủ
exports.renderHomePage = (req, res) => {
    res.render('pages/home', { title: 'Trang Chủ' });
};

// Render danh sách sản phẩm
exports.renderProductListPage = (req, res) => {
    res.render('pages/products', { title: 'Sản Phẩm' });
};

// Render chi tiết sản phẩm
exports.renderProductDetailPage = (req, res) => {
    res.render('pages/product-detail', { title: 'Chi Tiết Sản Phẩm' });
};

// Render trang đăng nhập
exports.renderLoginPage = (req, res) => {
    res.render('pages/login', { title: 'Đăng Nhập' });
};

// Render trang đăng ký
exports.renderRegisterPage = (req, res) => {
    res.render('pages/register', { title: 'Đăng Ký' });
};

// Render trang giỏ hàng
exports.renderCartPage = (req, res) => {
    res.render('pages/cart', { title: 'Giỏ Hàng' });
};

// Render trang thanh toán
exports.renderCheckoutPage = (req, res) => {
    res.render('pages/checkout', { title: 'Thanh Toán' });
};

// Render trang đơn hàng của tôi
exports.renderMyOrdersPage = (req, res) => {
    res.render('pages/my-orders', { title: 'Đơn Hàng Của Tôi' });
};

// Render chi tiết đơn hàng
exports.renderOrderDetailPage = (req, res) => {
    res.render('pages/order-detail', { title: 'Chi Tiết Đơn Hàng' });
};

// Render trang hồ sơ
exports.renderProfilePage = (req, res) => {
    res.render('pages/profile', { title: 'Hồ Sơ' });
};

// Render trang quên mật khẩu
exports.renderForgotPasswordPage = (req, res) => {
    res.render('pages/forgot-password', { title: 'Quên Mật Khẩu' });
};

// Render trang reset mật khẩu
exports.renderResetPasswordPage = (req, res) => {
    res.render('pages/reset-password', { title: 'Đặt Lại Mật Khẩu' });
};
