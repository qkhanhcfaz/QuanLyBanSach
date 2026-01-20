const db = require('../src/models');
const { Review, User, Product } = db;

async function debugFetch() {
    try {
        await db.sequelize.authenticate();
        console.log("1. Simple Fetch (No Include)...");
        try {
            const simple = await Review.findOne();
            console.log("Simple Fetch: OK", simple ? simple.toJSON() : 'null');
        } catch (e) {
            console.error("Simple Fetch FAILED:", e.parent || e.message);
        }

        console.log("2. Complex Fetch (With Include)...");
        const { count, rows } = await Review.findAndCountAll({
            include: [
                { model: User, as: 'user', attributes: ['ho_ten', 'email'] },
                { model: Product, as: 'product', attributes: ['ten_sach', 'img'] }
            ],
            limit: 10,
            offset: 0
        });

        console.log("Complex Fetch: OK. count=", count);

    } catch (e) {
        console.error("Complex Fetch FAILED:", e.parent || e.message);
        console.log("SQL:", e.sql);
    } finally {
        await db.sequelize.close();
    }
}

debugFetch();
