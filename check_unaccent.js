const { sequelize } = require('./src/models');

async function checkUnaccent() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected.');

        try {
            // Try to create extension if not exists
            await sequelize.query('CREATE EXTENSION IF NOT EXISTS unaccent;');
            console.log('✅ Extension "unaccent" enabled/verified.');
        } catch (e) {
            console.error('⚠️ Could not enable "unaccent" extension. You might need superuser privileges.');
            console.error(e.message);
        }

        // Test unaccent function
        try {
            const [results] = await sequelize.query("SELECT unaccent('Hồ Chí Minh') as normalized;");
            console.log('Test unaccent:', results[0]);
        } catch (e) {
            console.error('❌ unaccent function check failed:', e.message);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkUnaccent();
