const { sequelize } = require('./src/config/connectDB');
const { Product } = require('./src/models');

const updateBestsellers = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // 1. Alter table to add 'da_ban' column
        // Using sync({ alter: true }) checks the current state and updates it to match the model
        await Product.sync({ alter: true });
        console.log('✅ Updated products table structure (Added da_ban).');

        // 2. Add random sales data
        const products = await Product.findAll();
        console.log(`Found ${products.length} products. Updating sales data...`);

        for (const p of products) {
            // Random sold count between 0 and 1000
            const randomSold = Math.floor(Math.random() * 1000);
            p.da_ban = randomSold;
            await p.save();
        }

        console.log('✅ Successfully updated fake sales data for all products.');

    } catch (error) {
        console.error('❌ Error updating bestsellers logic:', error);
    } finally {
        await sequelize.close();
    }
};

updateBestsellers();
