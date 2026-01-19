const { sequelize } = require('./src/config/connectDB');

async function checkSchema() {
    try {
        await sequelize.authenticate();
        const [results, metadata] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';");
        console.log('--- COLUMNS START ---');
        results.forEach(col => console.log(`${col.column_name}: ${col.data_type}`));
        console.log('--- COLUMNS END ---');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
