const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Favorite = sequelize.define('Favorite', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER, // hoặc BIGINT nếu product dùng BIGINT
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    }
}, {
    tableName: 'favorites',
    timestamps: true, // Lưu thời điểm thích
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'product_id']
        }
    ]
});

Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
    Favorite.belongsTo(models.Product, { foreignKey: 'product_id' });
};

module.exports = Favorite;
