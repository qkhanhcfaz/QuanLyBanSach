const { Product } = require('./src/models');
const { connectDB } = require('./src/config/connectDB');
const { Op } = require('sequelize');

(async () => {
    try {
        await connectDB();

        // Find all products with null or 0 pages
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { so_trang: null },
                    { so_trang: 0 }
                ]
            }
        });

        console.log(`Found ${products.length} products with missing page counts.`);

        for (const product of products) {
            // Generate random pages between 150 and 500
            const randomPages = Math.floor(Math.random() * (500 - 150 + 1)) + 150;
            product.so_trang = randomPages;
            await product.save();
            console.log(`Updated '${product.ten_sach}': ${randomPages} pages`);
        }

        console.log('All missing page counts updated successfully.');
    } catch (error) {
        console.error('Error updating pages:', error);
    } finally {
        process.exit();
    }
})();
