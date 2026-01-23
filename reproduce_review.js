const db = require('./src/models');
const { Review, User } = db;

async function testReview() {
    try {
        await db.sequelize.authenticate();
        console.log('DB Connected');

        if (!Review) {
            console.error('❌ Review model is NOT loaded!');
            return;
        }

        const reviews = await Review.findAll({
            limit: 1,
            include: [{ model: User, as: "user" }]
        });
        console.log('Reviews loaded:', reviews.length);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await db.sequelize.close();
    }
}

testReview();
