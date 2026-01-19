const db = require('../src/models');

async function fixCheckoutSchema() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        const missingCols = [
            { name: 'sdt_nguoi_nhan', type: 'VARCHAR(20)' },
            { name: 'email_nguoi_nhan', type: 'VARCHAR(255)' }
        ];

        for (const col of missingCols) {
            const [results] = await db.sequelize.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='orders' AND column_name='${col.name}';
            `);

            if (results.length === 0) {
                console.log(`Column '${col.name}' missing. Adding...`);
                await db.sequelize.query(`
                    ALTER TABLE "orders" 
                    ADD COLUMN "${col.name}" ${col.type};
                `);
                console.log(`Column '${col.name}' added.`);
            } else {
                console.log(`Column '${col.name}' already exists.`);
            }
        }

    } catch (error) {
        console.error("Error fixing schema:", error);
    } finally {
        await db.sequelize.close();
    }
}

fixCheckoutSchema();
