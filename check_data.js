
const { sequelize, Product, CartItem } = require('./src/models');

async function checkData() {
    try {
        const productCount = await Product.count();
        console.log(`Total Products: ${productCount}`);

        // Check if unique index exists on CartItem (approximation via describing table, or just assumption)
        // Usually cart logic enforces 1 entry per product per cart.
        console.log("Checking completed.");
    } catch (error) {
        console.error("Error:", error);
    }
}

checkData();
