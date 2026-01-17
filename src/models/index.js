'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('../config/connectDB');

// Import các models manually to ensure correct initialization order and handling
const Product = require('./productModel');
const Category = require('./categoryModel');
const Slideshow = require('./slideshowModel');
const Post = require('./postModel');
const SiteSetting = require('./siteSettingModel');
const Role = require('./roleModel');
const User = require('./userModel');
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');
// const Comment = require('./commentModel'); 
const Review = require('./reviewModel');
// const Receipt = require('./receiptModel');
// const ReceiptItem = require('./receiptItemModel');
// const Promotion = require('./promotionModel');

const db = {};

// Manually add models to db object
db.Product = Product;
db.Category = Category;
db.Slideshow = Slideshow;
db.Post = Post;
db.SiteSetting = SiteSetting;
db.Role = Role;
db.User = User;
// Safe require for Cart/Favorite which might be new
try { db.Cart = require('./cartModel'); } catch (e) { }
try { db.CartItem = require('./cartItemModel'); } catch (e) { }
try { db.Favorite = require('./favoriteModel'); } catch (e) { }
db.Order = Order;
db.OrderItem = OrderItem;
db.Review = require('./reviewModel');
try { db.Receipt = require('./receiptModel'); } catch (e) { }
try { db.ReceiptItem = require('./receiptItemModel'); } catch (e) { }
try { db.Promotion = require('./promotionModel'); } catch (e) { }

// Call associate if it exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

