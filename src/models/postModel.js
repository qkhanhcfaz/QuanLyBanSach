// File: /src/models/postModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Post', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        tieu_de: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        anh_dai_dien: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        noi_dung_ngan: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        noi_dung: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        trang_thai: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: 'posts',
        timestamps: true
    });
};
