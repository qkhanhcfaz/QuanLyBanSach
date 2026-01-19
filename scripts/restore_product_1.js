const db = require('../src/models');

async function restoreProduct1() {
    try {
        await db.sequelize.authenticate();
        console.log("Creating Product ID 1 (Raw SQL)...");

        try {
            // Use simple raw query
            await db.sequelize.query(`
                INSERT INTO "products" ("id", "ten_sach", "mo_ta_ngan", "gia_bia", "so_luong_ton_kho", "danh_muc_id", "product_type", "createdAt", "updatedAt", "img", "da_ban", "views")
                VALUES (1, 'Nhà Giả Kim', 'Mô tả ngắn', 79000, 100, 1, 'print_book', NOW(), NOW(), '/images/nha-gia-kim.png', 0, 0);
            `);
            console.log("SUCCESS: Product 1 created.");
        } catch (inner) {
            console.log("Insert Failed. Trying UPDATE just in case paranoid is weird...");
            // Maybe it exists but my check failed?
            console.error("INNER ERROR:", inner.parent || inner.message);
        }

    } catch (e) {
        console.error("Fatal Error:", e);
    } finally {
        await db.sequelize.close();
    }
}

restoreProduct1();
