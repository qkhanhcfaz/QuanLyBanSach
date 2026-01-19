const { User, Role } = require('../models');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    const { ho_ten, email, mat_khau, ten_dang_nhap } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            ho_ten,
            email,
            mat_khau, // Hook beforeCreate sẽ tự động mã hóa mật khẩu
            ten_dang_nhap,
            role_id: 2 // Mặc định là người dùng thường
        });

        if (user) {
            // Tạo token
            const token = generateToken(user.id, user.role_id);

            // Gửi cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
            });

            res.status(201).json({
                id: user.id,
                ho_ten: user.ho_ten,
                email: user.email,
                role_id: user.role_id,
                token: token
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, mat_khau } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu (hỗ trợ cả mã hóa và văn bản thuần cũ)
        let isMatch = await user.matchPassword(mat_khau);

        // Fallback cho mật khẩu cũ chưa mã hóa
        if (!isMatch && mat_khau === user.mat_khau) {
            isMatch = true;
            // Tùy chọn: Mã hóa lại và cập nhật để bảo mật cho lần sau
            user.mat_khau = mat_khau;
            await user.save();
        }

        if (isMatch) {
            const token = generateToken(user.id, user.role_id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/', // Ensure available on all pages
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
            });

            res.json({
                id: user.id,
                ho_ten: user.ho_ten,
                email: user.email,
                role_id: user.role_id,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Đăng xuất
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Đăng xuất thành công' });
};

module.exports = {
    register,
    login,
    logout
};
