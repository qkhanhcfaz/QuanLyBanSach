const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');
const User = require('./userModel');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for guest carts (potentially)
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'carts',
    timestamps: true
});

module.exports = Cart;
