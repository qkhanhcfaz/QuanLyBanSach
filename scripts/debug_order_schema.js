const { sequelize } = require('../src/config/connectDB');

const checkOrderSchema = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        // console.log('\n👉 Columns in "orders" table:');
        // const [ordersCols] = await sequelize.query(`
        //     SELECT column_name, data_type 
        //     FROM information_schema.columns 
        //     WHERE table_name = 'orders';
        // `);
        // console.table(ordersCols);

        console.log('\n👉 Columns in "order_items" table:');
        const [orderItemsCols] = await sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'order_items';
        `);
        orderItemsCols.forEach(c => console.log(` - ${c.column_name} (${c.data_type})`));

    } catch (error) {
        console.error('❌ Error checking schema:', error);
    } finally {
        await sequelize.close();
    }
};

checkOrderSchema();
