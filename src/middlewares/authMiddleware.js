const jwt = require('jsonwebtoken');
const db = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        if (req.originalUrl.startsWith('/admin')) {
            return res.redirect('/login');
        }
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await db.User.findByPk(decoded.id, {
            attributes: { exclude: ['mat_khau'] },
            include: {
                model: db.Role,
                as: 'role'
            }
        });

        if (!req.user) {
            return res.redirect('/login');
        }

        next();
    } catch (err) {
        console.error('Lỗi xác thực token:', err.message);
        return res.redirect('/login');
    }
};

const admin = (req, res, next) => {
    /**
     * CHỐT LOGIC:
     * - user phải tồn tại
     * - role phải được include
     * - role_id === 1 (ADMIN)
     * => CÁCH NÀY KHÔNG PHỤ THUỘC TÊN CỘT roles
     */
    // DEBUG LOG
    if (req.user) {
        console.log(`[AUTH DEBUG] User: ${req.user.email}, Role ID: ${req.user.role_id}`);
    } else {
        console.log('[AUTH DEBUG] No user found in request');
    }

    if (req.user && req.user.role_id == 1) {
        return next();
    }

    // Không phải admin
    if (req.originalUrl.startsWith('/admin')) {
        return res.status(403).render('pages/error', {
            title: '403 - Không có quyền',
            message: 'Bạn không có quyền Admin để truy cập trang này'
        });
    }

    return res.status(403).json({
        message: 'Không có quyền Admin'
    });
};


module.exports = { protect, admin };
