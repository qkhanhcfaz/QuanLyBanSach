// File: /src/models/index.js
// File tổng hợp tất cả models và thiết lập quan hệ (associations)

const { sequelize } = require('../config/connectDB');

// Import các models - productModel đã export trực tiếp model instance
const Product = require('./productModel');
const Category = require('./categoryModel')(sequelize);
const Slideshow = require('./slideshowModel')(sequelize);
const Post = require('./postModel')(sequelize);
const User = require('./userModel');
const Cart = require('./cartModel');
const CartDetail = require('./cartDetailModel');

// === THIẾT LẬP QUAN HỆ GIỮA CÁC MODELS ===
// 1. Product & Category
Product.belongsTo(Category, { foreignKey: 'danh_muc_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'danh_muc_id', as: 'products' });

// 2. User & Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 3. Cart & CartDetail & Product
Cart.hasMany(CartDetail, { foreignKey: 'cartId', as: 'items' });
CartDetail.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

Product.hasMany(CartDetail, { foreignKey: 'productId', as: 'cartItems' });
CartDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// === EXPORT CÁC MODELS VÀ SEQUELIZE INSTANCE ===
module.exports = {
    sequelize,
    Category,
    Product,
    Slideshow,
    Post,
    User,
    Cart,
    CartDetail
};
