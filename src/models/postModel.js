const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    tieu_de: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tom_tat: {
        type: DataTypes.STRING(500), // Short description
        allowNull: true
    },
    noi_dung: {
        type: DataTypes.TEXT, // Full HTML content
        allowNull: false
    },
    hinh_anh: {
        type: DataTypes.STRING, // URL image
        allowNull: true
    },
    trang_thai: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // true = Published, false = Draft
    },
    user_id: { // Author
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'posts',
    timestamps: true
});

module.exports = Post;
