const { sequelize } = require('../src/config/connectDB');

const dropPhoneColumn = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        try {
            await sequelize.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";');
            console.log('✅ Dropped column "phone" successfully.');
        } catch (error) {
            console.error('❌ Error dropping column:', error);
        }

    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await sequelize.close();
    }
};

dropPhoneColumn();
