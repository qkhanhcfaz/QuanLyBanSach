const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ten_quyen: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'roles',
    timestamps: false
});

Role.associate = (models) => {
    Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
    });
};

module.exports = Role;
