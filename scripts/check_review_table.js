const db = require('../src/models');

async function checkReviewTable() {
    try {
        await db.sequelize.authenticate();
        console.log("Checking 'reviews' table...");
        const tableExists = await db.sequelize.getQueryInterface().showAllSchemas().then(async () => {
            const tables = await db.sequelize.getQueryInterface().showAllTables();
            return tables.includes('reviews');
        });

        if (tableExists) {
            console.log("Table 'reviews' EXISTS.");
            const count = await db.Review.count();
            console.log(`Row count: ${count}`);
        } else {
            console.log("Table 'reviews' DOES NOT EXIST.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await db.sequelize.close();
    }
}

checkReviewTable();
