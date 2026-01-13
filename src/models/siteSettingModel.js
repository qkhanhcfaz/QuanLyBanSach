const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SiteSetting = sequelize.define('SiteSetting', {
    ten_website: { type: DataTypes.STRING, allowNull: false, defaultValue: 'BookZone' },
    dia_chi: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Quận 5, TP. Hồ Chí Minh' },
    email: { type: DataTypes.STRING, allowNull: false, defaultValue: 'bookzone@gmail.com' },
    so_dien_thoai: { type: DataTypes.STRING, allowNull: false, defaultValue: '0339 945 345' },

    // ✅ KHỚP DB HIỆN TẠI
    facebook: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
    twitter: { type: DataTypes.STRING, allowNull: true },
    linkedin: { type: DataTypes.STRING, allowNull: true },

    nam_ban_quyen: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2025 }
  });

  return SiteSetting;
};
