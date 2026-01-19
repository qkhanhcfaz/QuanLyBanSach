const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ho_ten: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chu_de: {
        type: DataTypes.STRING
    },
    noi_dung: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    trang_thai: {
        type: DataTypes.STRING,
        defaultValue: 'new' // new, read, replied
    }
}, {
    tableName: 'contacts',
    timestamps: true
});

module.exports = Contact;
