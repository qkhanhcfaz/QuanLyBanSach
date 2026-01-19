const db = require('../src/models');

async function listProducts() {
    try {
        await db.sequelize.authenticate();
        const prods = await db.Product.findAll({ paranoid: false, attributes: ['id', 'ten_sach'] });
        console.log("Products:", prods.map(p => ({ id: p.id, name: p.ten_sach })));
    } catch (e) { console.error(e); }
    finally { await db.sequelize.close(); }
}
listProducts();
