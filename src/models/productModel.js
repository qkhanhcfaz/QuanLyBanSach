// File: /src/models/productModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

// Định nghĩa model Product
const Product = sequelize.define('Product', {
    ten_sach: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mo_ta_ngan: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    gia_bia: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },

    so_luong_ton_kho: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    tac_gia: {
        type: DataTypes.STRING,
        allowNull: true
    },

    nha_xuat_ban: {
        type: DataTypes.STRING,
        allowNull: true
    },

    nam_xuat_ban: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    img: {
        type: DataTypes.STRING,
        allowNull: true
    },

    so_trang: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    product_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'print_book'
    },

    ebook_url: {
        type: DataTypes.STRING,
        allowNull: true
    },

    danh_muc_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    }

}, {
    tableName: 'products',
    timestamps: true
});

// ✅ CHỈ GIỮ QUAN HỆ TỐI THIỂU – AN TOÀN – CHẠY ĐƯỢC
Product.associate = (models) => {
    Product.belongsTo(models.Category, {
        foreignKey: 'danh_muc_id',
        as: 'category'
    });
};

module.exports = Product;
