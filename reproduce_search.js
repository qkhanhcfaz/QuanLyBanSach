const db = require('./src/models');
const { Product } = db;
const { Op } = require('sequelize');

async function testSearch() {
    try {
        await db.sequelize.authenticate();
        console.log('DB Connected');

        // 1. List some products
        const all = await Product.findAll({ limit: 3, attributes: ['id', 'ten_sach'] });

        if (all.length === 0) {
            console.log('No products to search.');
            return;
        }

        // Pick a keyword from the first product
        const sampleName = all[0].ten_sach;
        console.log(`Sample product: ${sampleName}`);

        const keyword = sampleName.split(' ')[0] || "Sách";
        console.log(`Searching for: "${keyword}"`);

        // 2. Perform search query
        const results = await Product.findAll({
            where: {
                trang_thai: true,
                ten_sach: { [Op.iLike]: `%${keyword}%` }
            }
        });

        console.log(`Found: ${results.length} products.`);
        results.forEach(p => console.log(` - ${p.ten_sach}`));

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await db.sequelize.close();
    }
}

testSearch();
