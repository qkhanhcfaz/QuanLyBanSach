"use strict";

const { sequelize } = require("../config/connectDB");

// Import các models manually để đảm bảo thứ tự khởi tạo
const Product = require("./productModel");
const Category = require("./categoryModel");
const Slideshow = require("./slideshowModel");
const Post = require("./postModel"); // [NEW/MERGED]
const SiteSetting = require("./siteSettingModel");
const Role = require("./roleModel");
const User = require("./userModel");
const Order = require("./orderModel");
const OrderItem = require("./orderItemModel");

// Optional models (có thể chưa tồn tại ở một số branch)
const safeRequire = (p) => {
  try {
    return require(p);
  } catch (e) {
    // Có thể log nhẹ nếu cần debug
    // console.warn(`Optional model missing: ${p} -> ${e.message}`);
    return null;
  }
};

const Cart = safeRequire("./cartModel");
const CartItem = safeRequire("./cartItemModel");
const Favorite = safeRequire("./favoriteModel");
const Review = safeRequire("./reviewModel");
const Receipt = safeRequire("./receiptModel");
const ReceiptItem = safeRequire("./receiptItemModel");
const Promotion = safeRequire("./promotionModel");

const Message = safeRequire("./messageModel");
const Contact = safeRequire("./contactModel"); // [NEW/MERGED]

const db = {};

// Add models to db object
db.Product = Product;
db.Category = Category;
db.Slideshow = Slideshow;
db.Post = Post;
db.SiteSetting = SiteSetting;
db.Role = Role;
db.User = User;
db.Order = Order;
db.OrderItem = OrderItem;

if (Cart) db.Cart = Cart;
if (CartItem) db.CartItem = CartItem;
if (Favorite) db.Favorite = Favorite;
if (Review) db.Review = Review;
if (Receipt) db.Receipt = Receipt;
if (ReceiptItem) db.ReceiptItem = ReceiptItem;
if (Promotion) db.Promotion = Promotion;
if (Message) db.Message = Message;
if (Contact) db.Contact = Contact; // [NEW/MERGED]

// Define Associations
if (db.User && db.Message) {
  // User <-> Message
  db.User.hasMany(db.Message, { foreignKey: "user_id", as: "messages" });
  db.Message.belongsTo(db.User, { foreignKey: "user_id", as: "user" });
}

// [NEW/MERGED] User <-> Post (Author)
if (db.User && db.Post) {
  db.User.hasMany(db.Post, { foreignKey: "user_id", as: "posts" });
  db.Post.belongsTo(db.User, { foreignKey: "user_id", as: "author" });
}

// Call associate if it exists in each model
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

// Export sequelize
db.sequelize = sequelize;

module.exports = db;
