const db = require('../models');
const { User, Role, Cart, CartItem } = db;
const bcrypt = require('bcryptjs');

/**
 * Lấy danh sách người dùng (Phân trang)
 */
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            include: [{ model: Role, as: 'role' }],
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['mat_khau'] } // Không trả về mật khẩu
        });

        res.status(200).json({
            users: rows,
            totalUsers: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Lấy chi tiết 1 người dùng
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{ model: Role, as: 'role' }],
            attributes: { exclude: ['mat_khau'] }
        });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Tạo người dùng mới (Admin)
 */
const createUser = async (req, res) => {
    try {
        const { ho_ten, ten_dang_nhap, email, mat_khau, role_id, trang_thai } = req.body;

        // Check exist
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ message: 'Email đã tồn tại' });

        // Default role_id = 2 (User) if not provided
        const finalRoleId = role_id || 2;

        const newUser = await User.create({
            ho_ten,
            ten_dang_nhap,
            email,
            mat_khau, // Model hooks will hash this
            role_id: finalRoleId,
            trang_thai: trang_thai !== undefined ? trang_thai : true
        });

        res.status(201).json({ message: 'Tạo thành công', user: newUser });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Cập nhật người dùng
 */
const updateUser = async (req, res) => {
    try {
        const { ho_ten, email, role_id, trang_thai, mat_khau } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        user.ho_ten = ho_ten || user.ho_ten;
        user.email = email || user.email;
        user.role_id = role_id || user.role_id;
        if (trang_thai !== undefined) user.trang_thai = trang_thai;

        if (mat_khau) {
            user.mat_khau = mat_khau; // Model hook will hash this on save
        }

        await user.save();
        res.status(200).json({ message: 'Cập nhật thành công', user });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Xóa người dùng
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { include: ['role'] });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        // Bảo vệ tài khoản Admin (Giả sử role_id 1 là Admin hoặc check tên role)
        // Hoặc bảo vệ chính mình
        if (req.user.id === user.id) {
            return res.status(400).json({ message: 'Không thể xóa chính mình!' });
        }

        if (user.role && (user.role.ten_quyen.toLowerCase() === 'admin' || user.role.ten_quyen.toLowerCase() === 'quản trị viên')) {
            return res.status(400).json({ message: 'Không thể xóa tài khoản Quản trị viên! (Role: ' + user.role.ten_quyen + ')' });
        }

        if (user.role_id === 1 || user.role_id === '1') {
            return res.status(400).json({ message: 'Không thể xóa tài khoản có ID Vai trò là 1 (Admin)!' });
        }

        // Xóa giỏ hàng liên quan trước
        const cart = await Cart.findOne({ where: { user_id: user.id } });
        if (cart) {
            await CartItem.destroy({ where: { cart_id: cart.id } });
            await cart.destroy();
        }

        await user.destroy();
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

/**
 * Lấy thông tin profile của chính mình
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['mat_khau'] },
            include: [{ model: Role, as: 'role' }]
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * Đổi mật khẩu của chính mình
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới' });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra mật khẩu cũ
        let isMatch = await user.matchPassword(currentPassword);

        // Fallback cho mật khẩu cũ chưa mã hóa (giống login)
        if (!isMatch && currentPassword === user.mat_khau) {
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
        }

        // Cập nhật mật khẩu mới
        user.mat_khau = newPassword; // Hooks will hash this
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công!' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Lỗi server khi đổi mật khẩu' });
    }
};

/**
 * Cập nhật thông tin profile của chính mình
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.ho_ten = req.body.ho_ten || user.ho_ten;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.dia_chi = req.body.dia_chi || user.dia_chi;

            // Handle Avatar Upload
            if (req.file) {
                user.img = '/uploads/avatars/' + req.file.filename;
            }

            // Check if email changed and is unique (omitted for brevity, but should be done)

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                ho_ten: updatedUser.ho_ten,
                ten_dang_nhap: updatedUser.ten_dang_nhap,
                email: updatedUser.email,
                phone: updatedUser.phone,
                dia_chi: updatedUser.dia_chi,
                img: updatedUser.img,
                role_id: updatedUser.role_id,
                token: generateToken(updatedUser.id, updatedUser.role_id) // Optional: return new token if needed
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

function generateToken(id, roleId) {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ id, role_id: roleId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserProfile,
    updateUserProfile,
    changePassword
};
