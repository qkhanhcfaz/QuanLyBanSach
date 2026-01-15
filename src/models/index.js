'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { sequelize } = require('../config/connectDB');
const basename = path.basename(__filename);

// Import các models - productModel đã export trực tiếp model instance
const Product = require('./productModel');
const Category = require('./categoryModel')(sequelize);
const Slideshow = require('./slideshowModel')(sequelize);
const Post = require('./postModel')(sequelize);
const SiteSetting = require('./siteSettingModel')(sequelize);
const db = {};

// Đọc tất cả các file trong thư mục hiện tại
fs.readdirSync(__dirname)
  .filter(file => {
    // Lọc ra các file javascript, không phải file ẩn, không phải file index.js
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // Import model từ file
    const model = require(path.join(__dirname, file));
    // Gắn model vào đối tượng db, với key là tên model (ví dụ: 'User')
    db[model.name] = model;
  });

// Sau khi đã import TẤT CẢ các model, lúc này mới gọi hàm associate
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
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
// Gắn sequelize instance và class Sequelize vào đối tượng db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
