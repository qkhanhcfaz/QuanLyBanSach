const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
        allowNull: false
    },
    dia_chi_giao_hang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ghi_chu_khach_hang: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Tiền
    tong_tien_hang: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    phi_van_chuyen: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    tong_thanh_toan: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    }
}, {
    tableName: 'orders',
    timestamps: true
});

Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
};

module.exports = Order;
