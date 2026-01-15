// Auth Middleware

// Middleware để bảo vệ các route (yêu cầu đăng nhập)
exports.protect = (req, res, next) => {
    // Placeholder - kiểm tra nếu user đã đăng nhập
    next();
};

// Middleware để kiểm tra quyền admin
exports.admin = (req, res, next) => {
    // Placeholder - kiểm tra nếu user là admin
    next();
};
