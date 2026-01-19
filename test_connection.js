
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log
    }
);

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.close();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

test();
