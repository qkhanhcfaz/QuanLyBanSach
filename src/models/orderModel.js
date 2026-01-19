const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectDB");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    ten_nguoi_nhan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email_nguoi_nhan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sdt_nguoi_nhan: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dia_chi_giao_hang: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ghi_chu_khach_hang: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tong_tien_hang: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    phi_van_chuyen: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    tong_thanh_toan: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    phuong_thuc_thanh_toan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    trang_thai_don_hang: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled",
      ),
      defaultValue: "pending",
    },
    trang_thai_thanh_toan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    paranoid: true, // Soft delete: thêm cột deletedAt
  },
);

Order.associate = (models) => {
  if (models.User) {
    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }

  if (models.OrderItem) {
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "orderItems",
      onDelete: "CASCADE",
    });
  }
};

module.exports = Order;
