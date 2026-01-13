// File: /src/models/index.js
// File tổng hợp tất cả models và thiết lập quan hệ (associations)

const { sequelize } = require('../config/connectDB');

// Import các models - productModel đã export trực tiếp model instance
const Product = require('./productModel');
const Category = require('./categoryModel')(sequelize);
const Slideshow = require('./slideshowModel')(sequelize);
const Post = require('./postModel')(sequelize);
const SiteSetting = require('./siteSettingModel')(sequelize);

// === THIẾT LẬP QUAN HỆ GIỮA CÁC MODELS ===
// Product thuộc về Category
Product.belongsTo(Category, {
    foreignKey: 'danh_muc_id',
    as: 'category'
});

// Category có nhiều Products
Category.hasMany(Product, {
    foreignKey: 'danh_muc_id',
    as: 'products'
});

// === EXPORT CÁC MODELS VÀ SEQUELIZE INSTANCE ===
module.exports = {
    sequelize,
    Category,
    Product,
    Slideshow,
    Post,
    SiteSetting
};
