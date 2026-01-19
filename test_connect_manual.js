require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log("Testing connection with:");
console.log("User:", process.env.DB_USER);
console.log("Pass:", process.env.DB_PASSWORD);
console.log("DB:", process.env.DB_DATABASE);

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection successful.');
    } catch (error) {
        console.error('❌ Connection failed:', error.original ? error.original.message : error.message);
    }
})();
