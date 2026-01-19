const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
<<<<<<< HEAD
      },
      trang_thai_don_hang: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled'),
        defaultValue: 'pending'
      },
      phuong_thuc_thanh_toan: {
        type: DataTypes.STRING,
        defaultValue: 'COD'
      },
      trang_thai_thanh_toan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      // Thông tin người nhận hàng
      ten_nguoi_nhan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email_nguoi_nhan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      so_dt_nguoi_nhan: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
      },
      dia_chi_giao_hang: {
        type: DataTypes.STRING,
        allowNull: false
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
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

  return Order;
};
