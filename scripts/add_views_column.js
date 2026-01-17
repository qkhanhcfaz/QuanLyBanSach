const { sequelize } = require('../src/config/connectDB');

async function addViewsColumn() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const queryInterface = sequelize.getQueryInterface();

        // Kiểm tra xem cột views đã tồn tại chưa
        const tableDesc = await queryInterface.describeTable('products');

        if (!tableDesc.views) {
            console.log('Adding "views" column to "products" table...');
            await queryInterface.addColumn('products', 'views', {
                type: 'INTEGER',
                allowNull: false,
                defaultValue: 0
            });
            console.log('Column "views" added successfully.');
        } else {
            console.log('Column "views" already exists.');
        }

    } catch (error) {
        console.error('Unable to add column:', error);
    } finally {
        await sequelize.close();
    }
}

addViewsColumn();
