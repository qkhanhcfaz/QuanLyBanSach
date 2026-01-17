// File: /src/models/productModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/connectDB");

// Định nghĩa model 'Product' tương ứng với bảng 'products' trong CSDL
const Product = sequelize.define(
  "Product",
  {
    // Sequelize sẽ tự động tạo cột 'id' làm khóa chính (primary key)

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

    // --- [MỚI] THÊM CỘT NÀY ĐỂ TÍNH BEST SELLER ---
    da_ban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Mặc định là 0 khi tạo mới
      comment: "Số lượng sản phẩm đã bán (Dùng để sắp xếp Top Bán Chạy)",
    },
    // ----------------------------------------------

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
    img: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL đến hình ảnh đại diện của sản phẩm",
    },
    so_trang: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    da_ban: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    product_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "print_book",
      comment: "Loại sản phẩm: sách in (print_book) hoặc ebook",
    },
    ebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Đường dẫn gốc đến file ebook",
    },
    danh_muc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  },
);

// Associations
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
