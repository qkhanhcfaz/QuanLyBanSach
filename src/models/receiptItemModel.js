const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const ReceiptItem = sequelize.define('ReceiptItem', {
    receipt_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    so_luong: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    don_gia_nhap: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    }
}, {
    tableName: 'receipt_items',
    timestamps: false
});

ReceiptItem.associate = (models) => {
    // ReceiptItem.belongsTo(models.Receipt, { foreignKey: 'receipt_id' });
    // ReceiptItem.belongsTo(models.Product, { foreignKey: 'product_id' });
};

module.exports = ReceiptItem;
