// File: /src/models/productModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectDB");

// Định nghĩa model 'Product' tương ứng với bảng 'products'
const Product = sequelize.define(
  "Product",
  {
    // ========================
    // THÔNG TIN CƠ BẢN
    // ========================
    ten_sach: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mo_ta_ngan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    gia_bia: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    so_luong_ton_kho: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // ========================
    // THỐNG KÊ
    // ========================
    da_ban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Số lượng sản phẩm đã bán (Top bán chạy)",
    },

    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // ========================
    // THÔNG TIN XUẤT BẢN
    // ========================
    tac_gia: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    nha_xuat_ban: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    nam_xuat_ban: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    so_trang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: true,
        min: 1,
      },
    },

    img: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL hình ảnh sản phẩm",
    },

    // ========================
    // PHÂN LOẠI SẢN PHẨM
    // ========================
    product_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "print_book",
      comment: "print_book | ebook",
    },

    ebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Link tải ebook",
    },

    // ========================
    // TRẠNG THÁI (MỚI)
    // ========================
    trang_thai: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "true = đang bán, false = ẩn / ngừng bán",
    },

    // ========================
    // KHÓA NGOẠI
    // ========================
    danh_muc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

// ========================
// ASSOCIATIONS
// ========================
Product.associate = (models) => {
  if (models.Category) {
    Product.belongsTo(models.Category, {
      foreignKey: "danh_muc_id",
      as: "category",
    });
  }

  if (models.OrderItem) {
    Product.hasMany(models.OrderItem, {
      foreignKey: "product_id",
      as: "orderItems",
      onDelete: "CASCADE",
      hooks: true,
    });
  }

  if (models.CartItem) {
    Product.hasMany(models.CartItem, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
      hooks: true,
    });
  }

  if (models.Review) {
    Product.hasMany(models.Review, {
      foreignKey: "product_id",
      as: "reviews",
      onDelete: "CASCADE",
      hooks: true,
    });
  }

  if (models.ReceiptItem) {
    Product.hasMany(models.ReceiptItem, {
      foreignKey: "product_id",
      as: "receiptHistory",
    });
  }
};

module.exports = Product;
