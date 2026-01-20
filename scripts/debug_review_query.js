const db = require('../src/models');
const { Review, User, Product } = db;

async function debugReviews() {
    try {
        console.log("Connecting to DB...");
        // Ensure DB connection
        await db.sequelize.authenticate();
        console.log("Connection successful.");

        console.log("Attempting Review.findAndCountAll...");
        const { count, rows } = await Review.findAndCountAll({
            include: [
                { model: User, as: 'user', attributes: ['ho_ten', 'email'] },
                { model: Product, as: 'product', attributes: ['ten_sach', 'img'] }
            ],
            order: [['createdAt', 'DESC']],
            limit: 10,
            offset: 0
        });

        console.log(`Success! Found ${count} reviews.`);
        console.log(JSON.stringify(rows, null, 2));

    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('review_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.error("Error written to review_error.log");
    } finally {
        await db.sequelize.close();
    }
}

debugReviews();
