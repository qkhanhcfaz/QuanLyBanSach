const { sequelize } = require('../src/config/connectDB');

async function fixRoleColumns() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        const queryInterface = sequelize.getQueryInterface();
        const table = 'roles';
        const { DataTypes } = require('sequelize');

        // Helper function to add column if it doesn't exist
        const addColumnIfNotExists = async (columnName, type) => {
            try {
                const tableInfo = await queryInterface.describeTable(table);
                if (!tableInfo[columnName]) {
                    console.log(`Adding column: ${columnName}...`);
                    await queryInterface.addColumn(table, columnName, type);
                    console.log(`✅ Added ${columnName}`);
                } else {
                    console.log(`ℹ️ Column ${columnName} already exists.`);
                }
            } catch (err) {
                console.error(`Error adding ${columnName}:`, err.original || err);
            }
        };

        await addColumnIfNotExists('createdAt', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        });

        await addColumnIfNotExists('updatedAt', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        });

        console.log('🎉 Roles schema update finished.');

    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        await sequelize.close();
    }
}

fixRoleColumns();
