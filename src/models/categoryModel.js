// File: /src/models/categoryModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Category', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ten_danh_muc: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        mo_ta: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        danh_muc_cha_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'categories',
        timestamps: true
    });
};
