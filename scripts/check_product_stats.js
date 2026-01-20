const db = require('../src/models');

async function checkProductStats() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        console.log("Checking 'products' table for 'luot_xem'...");
        const [results] = await db.sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='luot_xem';
        `);

        if (results.length > 0) {
            console.log("Column 'luot_xem' exists.");
        } else {
            console.log("Column 'luot_xem' MISSING.");
            // Add it if missing
            console.log("Adding 'luot_xem' column...");
            await db.sequelize.query(`
                ALTER TABLE "products" 
                ADD COLUMN "luot_xem" INTEGER DEFAULT 0;
            `);
            console.log("Column 'luot_xem' added.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await db.sequelize.close();
    }
}

checkProductStats();
