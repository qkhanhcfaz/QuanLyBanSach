const { sequelize } = require('../src/config/connectDB');
const { OrderItem } = require('../src/models');

const fixTable = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // 1. Drop table
        console.log('👉 Dropping "order_items" table...');
        await sequelize.query('DROP TABLE IF EXISTS "order_items" CASCADE;');
        console.log('✅ Dropped.');

        // 2. Re-sync model
        console.log('👉 Syncing "OrderItem" model...');
        await OrderItem.sync({ force: true });
        console.log('✅ Synced (Table recreated).');

        // 3. Verify columns
        console.log('\n👉 New columns in "order_items":');
        const [cols] = await sequelize.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns 
            WHERE table_name = 'order_items';
        `);
        cols.forEach(c => console.log(` - ${c.column_name} (${c.data_type}) [Default: ${c.column_default}]`));

    } catch (error) {
        console.error('❌ Error fixing table:', error);
    } finally {
        await sequelize.close();
    }
};

fixTable();
