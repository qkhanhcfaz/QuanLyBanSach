const { sequelize } = require('./src/models');

async function checkColumns() {
    try {
        await sequelize.authenticate();
        const [results, metadata] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reviews';
    `);
        console.log('Columns in reviews table:', results);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

checkColumns();
