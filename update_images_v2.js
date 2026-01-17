const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Kết nối database (sử dụng thông tin từ .env hoặc mặc định)
const sequelize = new Sequelize(
    process.env.DB_NAME || 'book_store_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '123456',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ten_sach: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'products',
    timestamps: true
});

async function updateImages() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Update Rừng Na Uy
        const rungNaUy = await Product.update(
            { img: '/images/rung-na-uy.png' },
            {
                where: {
                    ten_sach: { [Sequelize.Op.iLike]: '%Rừng Na Uy%' }
                }
            }
        );
        console.log(`Updated Rừng Na Uy: ${rungNaUy[0]} rows affected.`);

        // Update Đồi Gió Hú
        const doiGioHu = await Product.update(
            { img: '/images/doi-gio-hu.png' },
            {
                where: {
                    ten_sach: { [Sequelize.Op.iLike]: '%Đồi Gió Hú%' }
                }
            }
        );
        console.log(`Updated Đồi Gió Hú: ${doiGioHu[0]} rows affected.`);

    } catch (error) {
        console.error('Unable to connect to the database or update:', error);
    } finally {
        await sequelize.close();
    }
}

updateImages();
