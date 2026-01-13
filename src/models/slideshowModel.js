// File: /src/models/slideshowModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Slideshow', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tieu_de: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phu_de: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        link_to: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        thu_tu_hien_thi: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        tableName: 'slideshows',
        timestamps: true
    });
};
