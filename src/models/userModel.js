const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true }
    },
    role: {
        type: DataTypes.STRING, // 'admin', 'user'
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
