"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const { sequelize } = require("../config/connectDB");
const basename = path.basename(__filename);

const db = {};

// Đọc tất cả các file trong thư mục hiện tại
fs.readdirSync(__dirname)
  .filter((file) => {
    // Lọc ra các file javascript, không phải file ẩn, không phải file index.js
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // Import model từ file
    // QUAN TRỌNG: Các file model cũ (productModel.js...) không được viết theo kiểu
    // module.exports = (sequelize, DataTypes) => ... mà export trực tiếp instance hoặc function.
    // ĐỂ TƯƠNG THÍCH: Chúng ta cần kiểm tra xem model export ra cái gì.

    // Tuy nhiên, để sửa nhanh theo cách của book_store, ta giả định các model User, Role mới
    // tuân thủ chuẩn book_store. Còn các model cũ như Product, Category có thể gây lỗi với code dynamic này
    // nếu chúng không theo chuẩn define(sequelize, DataTypes).

    // KIỂM TRA LẠI: Trong QuanLyBanSach, index.js cũ import kiểu:
    // const Product = require('./productModel');
    // const Category = require('./categoryModel')(sequelize);

    // productModel.js export trực tiếp `sequelize.define(...)` -> OK (instance)
    // categoryModel.js export `module.exports = (sequelize) => sequelize.define(...)` -> Function

    // Code dynamic của book_store (dòng 23: require(path.join(__dirname, file))) sẽ lấy module.exports
    // Sau đó gán db[model.name] = model.
    // Nếu model là function (Category), model.name sẽ là tên hàm (hoặc undefined).
    // Nếu model là instance (Product), model.name là 'Product'.

    // => Code dynamic này CHỈ CHẠY ĐÚNG nếu TẤT CẢ model đều export instance hoặc đều export function define.
    // `book_store` dùng: const model = require(...)
    // `userModel.js` của book_store export instance: `module.exports = User;` (dòng 148 step 150)

    // VẬY LÀM SAO ĐỂ HÒA HỢP?
    // Cách tốt nhất là sửa `index.js` để KHÔNG dùng dynamic loading quá cứng nhắc,
    // hoặc sửa các model cũ cho chuẩn.
    // NHƯNG user muốn "giống code dự án book_store".

    // Code book_store index.js đơn giản là require file.
    // Nếu file export instance (User, Product), thì `model` là instance. `model.name` ok.
    // Nếu file export function (Category), `model` là function. `model.name` là tên hàm.
    // Ta cần gọi function đó để lấy instance.

    // Sửa đổi nhẹ logic dynamic loading để hỗ trợ cả 2 kiểu:
    const modelDef = require(path.join(__dirname, file));
    let model;
    if (
      typeof modelDef === "function" &&
      !modelDef.tableName &&
      !modelDef.name
    ) {
      // Trường hợp export function(sequelize) => return model matches Category, Post...
      // Nhưng chờ đã, CategoryModel.js cũ cần tham số sequelize.
      model = modelDef(sequelize, Sequelize.DataTypes);
    } else {
      // Trường hợp export instance (User, Role, Product)
      model = modelDef;
    }

    // Gán vào db
    if (model && model.name) {
      db[model.name] = model;
    }
  });

// Sau khi đã import TẤT CẢ các model, lúc này mới gọi hàm associate
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Gắn sequelize instance và class Sequelize vào đối tượng db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
