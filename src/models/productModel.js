// Tệp tin: /src/models/productModel.js
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
        allowNull: true,
        validate: {
            isInt: true,
            min: 1
        }
    },

    da_ban: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    // Trường để phân biệt sách in và ebook
    product_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'print_book', // 'print_book' hoặc 'ebook'
        comment: 'Loại sản phẩm: sách in (print_book) hoặc ebook'
    },

    // Trường để lưu link download cho ebook
    ebook_url: {
        type: DataTypes.STRING,
        allowNull: true, // Chỉ có giá trị khi product_type là 'ebook'
        comment: 'Đường dẫn gốc đến file ebook'
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

    // Thêm các quan hệ khác nếu cần thiết (được merge từ HEAD)
    Product.hasMany(models.OrderItem, {
        foreignKey: 'product_id',
        as: 'orderItems'
    });

    Product.hasMany(models.Review, {
        foreignKey: 'product_id',
        as: 'reviews'
    });


};

module.exports = Product;
