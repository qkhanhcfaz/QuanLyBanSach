const db = require('../src/models');

async function createProduct() {
    try {
        await db.sequelize.authenticate();
        console.log("Creating Nhà Giả Kim...");

        const p = await db.Product.create({
            ten_sach: 'Nhà Giả Kim',
            mo_ta_ngan: 'Cuốn sách bán chạy nhất mọi thời đại.',
            gia_bia: 79000,
            so_luong_ton_kho: 100,
            danh_muc_id: 1, // Sách Kinh Tế (mapped ID 1 for safety)
            product_type: 'print_book',
            img: '/images/nha-gia-kim.png',
            da_ban: 1000,
            views: 500
        });

        console.log(`CREATED Product: ID = ${p.id}`);

    } catch (e) {
        console.error("Error creating product:", e);
    } finally {
        await db.sequelize.close();
    }
}

createProduct();
