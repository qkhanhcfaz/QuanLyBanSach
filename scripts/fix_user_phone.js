const { sequelize } = require('../src/config/connectDB');

const fixUserTable = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // Attempt to add the phone column using raw SQL
        // We use catch to ignore error if column already exists
        try {
            await sequelize.query('ALTER TABLE "users" ADD COLUMN "phone" VARCHAR(20);');
            console.log('✅ Added column "phone" successfully.');
        } catch (error) {
            console.log('⚠️ Column "phone" might already exist or error:', error.original ? error.original.message : error.message);
        }

        console.log('✅ Fix script completed.');
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await sequelize.close();
    }
};

fixUserTable();
