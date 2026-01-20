const db = require('../src/models');

async function fixAllColumns() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        const possibleMissing = [
            { name: 'dia_chi', type: 'VARCHAR(255) NULL' },
            { name: 'ngay_sinh', type: 'DATE DEFAULT NULL' },
            { name: 'trang_thai', type: 'BOOLEAN DEFAULT TRUE' },
            { name: 'resetPasswordToken', type: 'VARCHAR(255) NULL' },
            { name: 'resetPasswordExpire', type: 'TIMESTAMPTZ NULL' }
        ];

        for (const col of possibleMissing) {
            const [results] = await db.sequelize.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='${col.name}';
            `);

            if (results.length > 0) {
                console.log(`Column '${col.name}' exists.`);
            } else {
                console.log(`Column '${col.name}' missing. Adding...`);
                await db.sequelize.query(`
                    ALTER TABLE "users" 
                    ADD COLUMN "${col.name}" ${col.type};
                `);
                console.log(`Column '${col.name}' added.`);
            }
        }

    } catch (error) {
        console.error("Error fixing table:", error);
    } finally {
        await db.sequelize.close();
    }
}

fixAllColumns();
