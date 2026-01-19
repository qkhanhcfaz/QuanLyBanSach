// File: /src/models/userModel.js (PHIÊN BẢN ĐÃ SỬA)

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectDB");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Sử dụng phương thức sequelize.define() để định nghĩa một model mới.
const User = sequelize.define(
  "User",
  {
    // Cột 'id': Khóa chính của bảng
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    // ==========================================================
    // ============= SỬA LẠI ĐỊNH NGHĨA CỘT ROLE_ID ==============
    // ==========================================================
    // Cột 'role_id': Khóa ngoại, liên kết tới bảng 'roles'
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 2, // Mặc định là 'User'
      // references đã được định nghĩa trong associate, bỏ tại đây để tránh lỗi syntax khi sync alter table
    },
    // ==========================================================

    ten_dang_nhap: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    mat_khau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ho_ten: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      defaultValue: 'default_avatar.png'
    },
    dia_chi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ngay_sinh: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      // Hook 'beforeCreate': Chạy trước khi tạo mới user vào database.
      beforeCreate: async (user) => {
        // Nếu user này có mật khẩu (tức là không phải login bằng Google/Facebook mà không có pass)
        // thì thực hiện mã hóa mật khẩu.
        if (user.mat_khau) {
          const salt = await bcrypt.genSalt(10); // Tạo chuỗi ngẫu nhiên (salt)
          user.mat_khau = await bcrypt.hash(user.mat_khau, salt); // Mã hóa mật khẩu
        }
      },
      // Hook 'beforeUpdate': Chạy trước khi cập nhật thông tin user.
      beforeUpdate: async (user) => {
        // Chỉ mã hóa lại mật khẩu nếu trường 'mat_khau' có thay đổi.
        if (user.changed("mat_khau")) {
          const salt = await bcrypt.genSalt(10);
          user.mat_khau = await bcrypt.hash(user.mat_khau, salt);
        }
      },
    },
  }
);

// --- CÁC PHƯƠNG THỨC MỞ RỘNG (INSTANCE METHODS) ---

// 1. Phương thức kiểm tra mật khẩu:
//    So sánh mật khẩu người dùng nhập vào (candidatePassword) với mật khẩu đã mã hóa trong database.
User.prototype.comparePassword = async function (candidatePassword) {
  // this.mat_khau: mật khẩu đã hash trong DB
  return await bcrypt.compare(candidatePassword, this.mat_khau);
};

// 2. Phương thức tạo token reset mật khẩu:
User.prototype.getResetPasswordToken = function () {
  // Tạo một chuỗi ngẫu nhiên 20 byte, chuyển sang dạng hex string.
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash chuỗi resetToken này và lưu vào database (để bảo mật, không lưu plain text).
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Đặt thời hạn hết hạn cho token là 15 phút (15 * 60 * 1000 ms).
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Trả về resetToken ban đầu (chưa hash) để gửi qua email cho người dùng.
  return resetToken;
};

// Định nghĩa mối quan hệ (Associations)
User.associate = (models) => {
  // User thuộc về một Role (User.role_id liên kết với Role.id)
  User.belongsTo(models.Role, {
    foreignKey: "role_id",
    as: "role",
  });

  // User có thể có nhiều đơn hàng (One-to-Many)
  User.hasMany(models.Order, {
    foreignKey: "user_id",
    as: "orders",
  });
};

module.exports = User;
