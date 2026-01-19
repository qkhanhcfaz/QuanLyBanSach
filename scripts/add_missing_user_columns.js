const { sequelize } = require('../src/config/connectDB');

const addMissingColumns = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const columnsToAdd = [
            { name: 'img', type: 'VARCHAR(255)', default: "'default_avatar.png'" },
            { name: 'dia_chi', type: 'VARCHAR(255)' },
            { name: 'ngay_sinh', type: 'DATE' },
            { name: 'trang_thai', type: 'BOOLEAN', default: 'true' },
            { name: 'resetPasswordToken', type: 'VARCHAR(255)' },
            { name: 'resetPasswordExpire', type: 'TIMESTAMPTZ' }
        ];

        for (const col of columnsToAdd) {
            try {
                let query = `ALTER TABLE "users" ADD COLUMN "${col.name}" ${col.type}`;
                if (col.default) {
                    query += ` DEFAULT ${col.default}`;
                }
                query += ';';

                await sequelize.query(query);
                console.log(`✅ Added column "${col.name}" successfully.`);
            } catch (error) {
                // Ignore error if column exists (code 42701 in Postgres)
                if (error.original && error.original.code === '42701') {
                    console.log(`ℹ️ Column "${col.name}" already exists.`);
                } else {
                    console.log(`⚠️ Error adding column "${col.name}":`, error.message);
                }
            }
        }

        console.log('✅ Schema update script completed.');

    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await sequelize.close();
    }
};

addMissingColumns();
