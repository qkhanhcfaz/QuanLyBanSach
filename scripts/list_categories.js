const db = require('../src/models');

async function listCats() {
    try {
        await db.sequelize.authenticate();
        const cats = await db.Category.findAll();
        console.log("Categories:", cats.map(c => ({ id: c.id, name: c.ten_danh_muc })));
    } catch (e) { console.error(e); }
    finally { await db.sequelize.close(); }
}
listCats();
