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
