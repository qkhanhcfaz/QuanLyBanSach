const { Product } = require('../src/models');
const { sequelize } = require('../src/config/connectDB');

async function testCreateProduct() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const newProduct = await Product.create({
            ten_sach: "Test Product Invalid Price",
            mo_ta_ngan: "Short description",
            gia_bia: "100,000", // String with comma
            tac_gia: "Author Test",
            nha_xuat_ban: "Publisher Test",
            danh_muc_id: "1", // String, assuming category 1 exists
            img: "/images/placeholder.png",
            product_type: undefined, // Simulating standard form submit
            ebook_url: undefined,
            so_luong_ton_kho: "10", // String
            nam_xuat_ban: "2022", // String
            so_trang: "300", // String
        });

        console.log("Create successful:", newProduct.id);
    } catch (error) {
        console.error("Create failed:", error);
        if (error.original) {
            console.error("Original DB Error:", error.original);
        }
    } finally {
        await sequelize.close();
    }
}

testCreateProduct();
