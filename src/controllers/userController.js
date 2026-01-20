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
 * Lấy thông tin profile của User đang login
 */
const getProfile = async (req, res) => {
    try {
        // req.user đã được populate bởi middleware checkUser hoặc protect
        // Tuy nhiên checkUser đôi khi chỉ lấy thông tin cơ bản, nên query lại cho chắc
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['mat_khau'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Map so_dien_thoai sang phone để frontend (profile.js) hiểu
        const userData = user.toJSON();
        userData.phone = user.so_dien_thoai || '';

        res.status(200).json(userData);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Cập nhật thông tin profile
 */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { ho_ten, email, phone, dia_chi, ngay_sinh } = req.body;

        user.ho_ten = ho_ten || user.ho_ten;
        user.email = email || user.email;
        user.dia_chi = dia_chi || user.dia_chi;
        if (ngay_sinh) user.ngay_sinh = ngay_sinh;

        // Cập nhật số điện thoại (nếu model có trường so_dien_thoai)
        // Lưu ý: Nếu model chưa có thì dòng này không có tác dụng lưu vào DB, nhưng cũng không lỗi
        if (phone) user.so_dien_thoai = phone;

        await user.save();

        // Trả về data mới
        const userData = user.toJSON();
        userData.phone = user.so_dien_thoai || '';

        // Nếu email thay đổi, có thể cần cấp lại token (tùy logic), nhưng ở đây tạm thời trả về user
        res.status(200).json(userData);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

/**
 * Đổi mật khẩu
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password cũ
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
        }

        // Cập nhật password mới
        user.mat_khau = newPassword; // Hook beforeUpdate sẽ hash
        await user.save();

        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword
};
