const { sequelize } = require('./src/models');

async function fixTable() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected.');

        // 1. Check if trang_thai exists
        const [results] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'reviews' AND column_name = 'trang_thai';
    `);

        if (results.length === 0) {
            console.log('Column trang_thai missing. Adding it...');
            await sequelize.query(`
        ALTER TABLE reviews 
        ADD COLUMN trang_thai BOOLEAN DEFAULT true;
      `);
            console.log('✅ Column added.');
        } else {
            console.log('Column trang_thai already exists.');
        }

        // 2. Check if user_id exists (just in case)
        const [userRes] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'reviews' AND column_name = 'user_id';
    `);
        if (userRes.length === 0) {
            console.log('Column user_id missing?? That would be bad.');
        } else {
            console.log('Column user_id exists.');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await sequelize.close();
    }
}

fixTable();
