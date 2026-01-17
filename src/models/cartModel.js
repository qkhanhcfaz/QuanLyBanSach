const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Cart = sequelize.define('Cart', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Tên bảng users
            key: 'id'
        }
    }
}, {
    tableName: 'carts',
    timestamps: true
});

Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
};

module.exports = Cart;

