const db = require("../models");
const { User, Role, Cart, CartItem } = db;
const bcrypt = require("bcryptjs");

/**
 * Lấy danh sách người dùng (Phân trang)
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      include: [{ model: Role, as: "role" }],
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["mat_khau"] }, // Không trả về mật khẩu
    });

    res.status(200).json({
      users: rows,
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Lấy chi tiết 1 người dùng
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role, as: "role" }],
      attributes: { exclude: ["mat_khau"] },
    });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Tạo người dùng mới (Admin)
 */
const createUser = async (req, res) => {
  try {
    const { ho_ten, ten_dang_nhap, email, mat_khau, role_id, trang_thai } =
      req.body;

    // Check exist
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

    // Default role_id = 2 (User) if not provided
    const finalRoleId = role_id || 2;

    const newUser = await User.create({
      ho_ten,
      ten_dang_nhap,
      email,
      mat_khau, // Model hooks will hash this
      role_id: finalRoleId,
      trang_thai: trang_thai !== undefined ? trang_thai : true,
    });

    res.status(201).json({ message: "Tạo thành công", user: newUser });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Cập nhật người dùng
 */
const updateUser = async (req, res) => {
  try {
    const { ho_ten, email, role_id, trang_thai, mat_khau } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.ho_ten = ho_ten || user.ho_ten;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;
    if (trang_thai !== undefined) user.trang_thai = trang_thai;

    if (mat_khau) {
      user.mat_khau = mat_khau; // Model hook will hash this on save
    }

    await user.save();
    res.status(200).json({ message: "Cập nhật thành công", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * @description     Admin: Xóa một người dùng.
 * @route           DELETE /api/users/:id
 * @access          Private/Admin
 */
const deleteUser = async (request, response) => {
  try {
    const user = await User.findByPk(request.params.id);
    if (user) {
      // Xóa người dùng khỏi CSDL
      await user.destroy();
      response.status(200).json({ message: "Xóa người dùng thành công." });
    } else {
      response.status(404).json({ message: "Không tìm thấy người dùng." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    response.status(500).json({ message: "Lỗi server.", error: error.message });
  }
};
/**
 * @description     Người dùng tự lấy thông tin cá nhân của mình
 * @route           GET /api/users/profile
 * @access          Private
 */
const getUserProfile = async (req, res) => {
  // req.user được lấy từ middleware 'protect'
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["mat_khau", "role_id"] },
  });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "Không tìm thấy người dùng." });
  }
};

/**
 * @description     Người dùng tự cập nhật thông tin cá nhân (không bao gồm mật khẩu)
 * @route           PUT /api/users/profile
 * @access          Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    user.ho_ten = req.body.ho_ten || user.ho_ten;
    user.phone = req.body.phone || user.phone;
    user.dia_chi = req.body.dia_chi || user.dia_chi;
    user.ngay_sinh = req.body.ngay_sinh || user.ngay_sinh;
    user.gioi_tinh = req.body.gioi_tinh || user.gioi_tinh;

    // Xử lý khi người dùng thay đổi email
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({
        where: { email: req.body.email },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email này đã được sử dụng." });
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    // Trả về thông tin user và một token MỚI (nếu email thay đổi)
    res.status(200).json({
      id: updatedUser.id,
      ho_ten: updatedUser.ho_ten,
      email: updatedUser.email,
      ten_dang_nhap: updatedUser.ten_dang_nhap,
      role_id: updatedUser.role_id,
      ngay_sinh: updatedUser.ngay_sinh,
      token: generateToken(updatedUser.id), // Tạo token mới để client cập nhật
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

/**
 * @description     Người dùng đổi mật khẩu
 * @route           PUT /api/users/change-password
 * @access          Private
 */
const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng điền đủ thông tin." });
  }
  try {
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.mat_khau);

    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu cũ không chính xác." });
    }
    user.mat_khau = newPassword; // Hook sẽ tự hash
    await user.save();
    res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
