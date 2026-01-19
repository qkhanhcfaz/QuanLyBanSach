const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const CartItem = sequelize.define('CartItem', {
    cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'carts',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER, // Giữ ID là integer cho đơn giản, hoặc BigInt nếu product dùng BigInt
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    so_luong: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    tableName: 'cart_items',
    timestamps: true
});

CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
};

module.exports = CartItem;
