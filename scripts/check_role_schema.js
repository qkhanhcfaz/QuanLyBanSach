const db = require('../src/models');

async function checkRoleSchema() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        console.log("Checking columns in 'roles' table...");
        const [results] = await db.sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='roles';
        `);

        console.log("Columns found:", results.map(r => r.column_name));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await db.sequelize.close();
    }
}

checkRoleSchema();
