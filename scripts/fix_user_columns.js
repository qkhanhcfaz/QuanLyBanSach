const { sequelize } = require('../src/config/connectDB');

async function fixUserColumns() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        const queryInterface = sequelize.getQueryInterface();
        const table = 'users';

        // Helper function to add column if it doesn't exist
        const addColumnIfNotExists = async (columnName, type) => {
            try {
                // Check if column exists by trying to select it (naive but works) or describe table
                // Better: use describeTable
                const tableInfo = await queryInterface.describeTable(table);
                if (!tableInfo[columnName]) {
                    console.log(`Adding column: ${columnName}...`);
                    await queryInterface.addColumn(table, columnName, type);
                    console.log(`✅ Added ${columnName}`);
                } else {
                    console.log(`ℹ️ Column ${columnName} already exists.`);
                }
            } catch (err) {
                console.error(`Error checking/adding ${columnName}:`, err.original || err);
            }
        };

        const { DataTypes } = require('sequelize');

        // Add missing columns based on User model
        await addColumnIfNotExists('img', {
            type: DataTypes.STRING,
            defaultValue: 'default_avatar.png'
        });

        await addColumnIfNotExists('dia_chi', {
             type: DataTypes.STRING,
             allowNull: true
        });

        await addColumnIfNotExists('ngay_sinh', {
             type: DataTypes.DATEONLY,
             allowNull: true
        });

        await addColumnIfNotExists('gioi_tinh', {
             type: DataTypes.STRING(10),
             allowNull: true
        });

        await addColumnIfNotExists('trang_thai', {
             type: DataTypes.BOOLEAN,
             defaultValue: true
        });

        await addColumnIfNotExists('resetPasswordToken', {
             type: DataTypes.STRING,
             allowNull: true
        });

        await addColumnIfNotExists('resetPasswordExpire', {
             type: DataTypes.DATE,
             allowNull: true
        });

        console.log('🎉 Database schema update finished.');

    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        await sequelize.close();
    }
}

fixUserColumns();
