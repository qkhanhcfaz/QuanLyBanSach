const { sequelize } = require('../src/config/connectDB');

const checkColumns = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const [results, metadata] = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);

        console.log('👉 Columns in "users" table:');
        console.table(results);

    } catch (error) {
        console.error('❌ Error checking columns:', error);
    } finally {
        await sequelize.close();
    }
};

checkColumns();
