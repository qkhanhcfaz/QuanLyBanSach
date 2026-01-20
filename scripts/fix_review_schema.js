const db = require('../src/models');

async function fixReviewSchema() {
    try {
        await db.sequelize.authenticate();
        console.log("Adding 'parent_id' column to 'reviews' table...");

        await db.sequelize.query(`
            ALTER TABLE "reviews" 
            ADD COLUMN IF NOT EXISTS "parent_id" BIGINT;
        `);

        console.log("Column 'parent_id' added successfully.");

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await db.sequelize.close();
    }
}

fixReviewSchema();
