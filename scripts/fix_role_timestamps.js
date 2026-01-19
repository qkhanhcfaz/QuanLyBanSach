const { sequelize } = require('../src/config/connectDB');

const addRoleTimestamps = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const columnsToAdd = [
            { name: 'createdAt', type: 'TIMESTAMPTZ', default: 'CURRENT_TIMESTAMP' },
            { name: 'updatedAt', type: 'TIMESTAMPTZ', default: 'CURRENT_TIMESTAMP' }
        ];

        for (const col of columnsToAdd) {
            try {
                let query = `ALTER TABLE "roles" ADD COLUMN "${col.name}" ${col.type}`;
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

        console.log('✅ Role schema update script completed.');

    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await sequelize.close();
    }
};

addRoleTimestamps();
