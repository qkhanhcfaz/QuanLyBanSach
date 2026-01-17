// File: /src/models/siteSettingModel.js
// Export trực tiếp sequelize.define(...) để tương thích auto-loader trong src/models/index.js.

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const SiteSetting = sequelize.define(
  'SiteSetting',
  {
    ten_website: { type: DataTypes.STRING, allowNull: false, defaultValue: 'BookZone' },
    dia_chi: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Quận 5, TP. Hồ Chí Minh' },
    email: { type: DataTypes.STRING, allowNull: false, defaultValue: 'bookzone@gmail.com' },
    so_dien_thoai: { type: DataTypes.STRING, allowNull: false, defaultValue: '0339 945 345' },

    facebook: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
    twitter: { type: DataTypes.STRING, allowNull: true },
    linkedin: { type: DataTypes.STRING, allowNull: true },

    nam_ban_quyen: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2025 },
  },
  {
    tableName: 'site_settings', // nếu DB bạn tên khác thì đổi lại
    timestamps: true,
  }
);

module.exports = SiteSetting;
