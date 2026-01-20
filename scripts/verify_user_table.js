const db = require('../src/models');

async function verifyTable() {
    try {
        console.log("Connecting...");
        await db.sequelize.authenticate();

        console.log("Querying information_schema for 'users' table columns...");
        const [results] = await db.sequelize.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);

        console.log("Columns found:", results.length);
        console.table(results);

        const checkCols = ['img', 'dia_chi', 'ngay_sinh', 'trang_thai', 'resetPasswordToken'];
        const existingCols = results.map(r => r.column_name);

        console.log("Existing columns:", existingCols);

        checkCols.forEach(col => {
            console.log(`Column '${col}' exists? ${existingCols.includes(col)}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await db.sequelize.close();
    }
}

verifyTable();
