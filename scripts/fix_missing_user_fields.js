const db = require('../src/models');

async function fixUserColumns() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        // Check for 'img' column
        const [results] = await db.sequelize.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='users' AND column_name='img';
        `);

        if (results.length > 0) {
            console.log("Column 'img' already exists.");
        } else {
            console.log("Column 'img' missing. Adding it...");
            await db.sequelize.query(`
                ALTER TABLE "users" 
                ADD COLUMN "img" VARCHAR(255) DEFAULT 'default_avatar.png';
            `);
            console.log("Column 'img' added successfully.");
        }

    } catch (error) {
        console.error("Error fixing table:", error);
    } finally {
        await db.sequelize.close();
    }
}

fixUserColumns();
