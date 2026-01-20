
const { sequelize } = require('./src/config/connectDB');

async function checkSchema() {
    try {
        const [results] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products'");
        console.log('Columns in products table:');
        results.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

        const hasTrangThai = results.some(col => col.column_name === 'trang_thai');
        if (!hasTrangThai) {
            console.log('❌ Column "trang_thai" is MISSING!');
            console.log('Attempting to add it manually...');
            await sequelize.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS trang_thai INTEGER DEFAULT 1');
            console.log('✅ Column "trang_thai" added successfully.');
        } else {
            console.log('✅ Column "trang_thai" already exists.');
        }
    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
