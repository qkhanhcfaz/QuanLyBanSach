const db = require('../src/models');

async function fixOrderSchema() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        // Fix Orders Table
        const orderCols = [
            { name: 'deletedAt', type: 'TIMESTAMPTZ NULL' },
            { name: 'createdAt', type: 'TIMESTAMPTZ DEFAULT NOW()' },
            { name: 'updatedAt', type: 'TIMESTAMPTZ DEFAULT NOW()' }
        ];

        console.log("Checking 'orders' table...");
        for (const col of orderCols) {
            const [results] = await db.sequelize.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='orders' AND column_name='${col.name}';
            `);

            if (results.length === 0) {
                console.log(`Column '${col.name}' missing in 'orders'. Adding...`);
                await db.sequelize.query(`
                    ALTER TABLE "orders" 
                    ADD COLUMN "${col.name}" ${col.type};
                `);
                console.log(`Column '${col.name}' added.`);
            } else {
                console.log(`Column '${col.name}' exists.`);
            }
        }

        // Fix OrderItems Table (Check timestamps)
        const itemCols = [
            { name: 'createdAt', type: 'TIMESTAMPTZ DEFAULT NOW()' },
            { name: 'updatedAt', type: 'TIMESTAMPTZ DEFAULT NOW()' }
        ];
        console.log("Checking 'order_items' table...");
        for (const col of itemCols) {
            const [results] = await db.sequelize.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='order_items' AND column_name='${col.name}';
            `);
            if (results.length === 0) {
                console.log(`Column '${col.name}' missing in 'order_items'. Adding...`);
                await db.sequelize.query(`
                    ALTER TABLE "order_items" 
                    ADD COLUMN "${col.name}" ${col.type};
                `);
                console.log(`Column '${col.name}' added.`);
            } else {
                console.log(`Column '${col.name}' exists.`);
            }
        }


    } catch (error) {
        console.error("Error fixing order schema:", error);
    } finally {
        await db.sequelize.close();
    }
}

fixOrderSchema();
