const { sequelize } = require('./src/config/connectDB');

async function dropTables() {
    try {
        await sequelize.authenticate();
        console.log('Dropping order_items...');
        await sequelize.query("DROP TABLE IF EXISTS order_items;");
        console.log('Dropping orders...');
        await sequelize.query("DROP TABLE IF EXISTS orders;");
        console.log('✅ Tables dropped successfully.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

dropTables();
