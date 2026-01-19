const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Receipt = sequelize.define('Receipt', {
    nha_cung_cap: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tong_tien: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    nguoi_nhap_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'receipts',
    timestamps: true
});

Receipt.associate = (models) => {
    // Add associations here if needed, e.g. belongsTo User (admin)
    // Receipt.belongsTo(models.User, { foreignKey: 'nguoi_nhap_id', as: 'importer' });
    // Receipt.hasMany(models.ReceiptItem, { foreignKey: 'receipt_id' });
};

module.exports = Receipt;
