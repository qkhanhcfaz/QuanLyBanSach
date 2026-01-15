// File: /src/models/userModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const User = sequelize.define('User', {
    ho_ten: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'mat_khau'
    },

    role_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 2   // 2 = user thường
        // ❌ TUYỆT ĐỐI KHÔNG ĐẶT references Ở ĐÂY
    }

}, {
    tableName: 'users',
    timestamps: true
});

// ✅ KHAI BÁO QUAN HỆ Ở ĐÂY
User.associate = (models) => {
    User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = User;
