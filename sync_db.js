const db = require('./src/models');
const { sequelize } = db;

async function syncDatabase() {
    try {
        console.log('🔄 Starting database sync (alter: true)...');
        await sequelize.authenticate();
        console.log('✅ Connection to DB successful.');

        // Updating schema for all models
        await sequelize.sync({ alter: true });

        console.log('✅ Database sync completed!');
    } catch (error) {
        console.error('❌ Database sync failed:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
