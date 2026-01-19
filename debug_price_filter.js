require('dotenv').config();
const db = require('./src/models');
const { Op } = require('sequelize');

const testPriceFilter = async (min, max) => {
    try {
        await db.sequelize.authenticate();
        console.log(`🔎 Test Lọc giá: ${min} - ${max}`);

        let where = {};
        where.gia_bia = {};
        if (min) where.gia_bia[Op.gte] = min;
        if (max) where.gia_bia[Op.lte] = max;

        const products = await db.Product.findAll({
            where: where,
            attributes: ['id', 'ten_sach', 'gia_bia'],
            limit: 5
        });

        if (products.length > 0) {
            console.log(`✅ Tìm thấy ${products.length} sản phẩm mẫu:`);
            products.forEach(p => console.log(`   - ${p.ten_sach}: ${p.gia_bia}`));
        } else {
            console.log('❌ Không tìm thấy sản phẩm trong khoảng giá này.');
        }

    } catch (error) {
        console.error('❌ Lỗi:', error);
    } finally {
        await db.sequelize.close();
    }
};

testPriceFilter(50000, 100000);
