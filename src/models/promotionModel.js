const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Promotion = sequelize.define('Promotion', {
    ten_km: {
        type: DataTypes.STRING,
        allowNull: true
    },
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    giam_gia_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ngay_bat_dau: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ngay_ket_thuc: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'promotions',
    timestamps: true
});

module.exports = Promotion;
