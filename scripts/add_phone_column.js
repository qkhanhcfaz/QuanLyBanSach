const { sequelize } = require('../src/config/connectDB');

async function addPhoneColumn() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const queryInterface = sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('users');

        if (!tableInfo.so_dien_thoai) {
            console.log('Adding so_dien_thoai column...');
            await queryInterface.addColumn('users', 'so_dien_thoai', {
                type: 'VARCHAR(20)',
                allowNull: true
            });
            console.log('Column added successfully.');
        } else {
            console.log('Column so_dien_thoai already exists.');
        }
    } catch (error) {
        console.error('Error adding column:', error);
    } finally {
        await sequelize.close();
    }
}

addPhoneColumn();
