'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('../config/connectDB');
const basename = path.basename(__filename);

// Import các models manually to ensure correct initialization order and handling
const Product = require('./productModel');
const Category = require('./categoryModel'); // Fixed: Removed (sequelize) call
const Slideshow = require('./slideshowModel'); // Fixed: Removed (sequelize) call
const Post = require('./postModel'); // Fixed: Removed (sequelize) call
const SiteSetting = require('./siteSettingModel')(sequelize); // Keeps factory function call
const Role = require('./roleModel'); // Added Role if it exists (saw in file list)
const User = require('./userModel'); // Added User if it exists (saw in file list)
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');

const db = {};

// Manually add models to db object
db.Product = Product;
db.Category = Category;
db.Slideshow = Slideshow;
db.Post = Post;
db.SiteSetting = SiteSetting;
db.Role = Role;
db.User = User;
db.Cart = require('./cartModel');
db.CartItem = require('./cartItemModel');
db.Favorite = require('./favoriteModel');
db.Order = Order;
db.OrderItem = OrderItem;
db.Review = require('./reviewModel');

// Call associate if it exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// Gắn sequelize instance và class Sequelize vào đối tượng db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
