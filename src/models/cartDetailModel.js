const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');
const Cart = require('./cartModel');
const Product = require('./productModel');

const CartDetail = sequelize.define('CartDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: { min: 1 }
    }
}, {
    tableName: 'cart_details',
    timestamps: true
});

module.exports = CartDetail;
