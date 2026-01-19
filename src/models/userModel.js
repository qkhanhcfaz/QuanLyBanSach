const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mat_khau: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ho_ten: DataTypes.STRING,
    trang_thai: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    ten_dang_nhap: DataTypes.STRING
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.mat_khau) {
                const salt = await bcrypt.genSalt(10);
                user.mat_khau = await bcrypt.hash(user.mat_khau, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('mat_khau')) {
                const salt = await bcrypt.genSalt(10);
                user.mat_khau = await bcrypt.hash(user.mat_khau, salt);
            }
        }
    }
});

// Method kiểm tra mật khẩu
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.mat_khau);
};

User.associate = (models) => {
    User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
    });
};

module.exports = User;
