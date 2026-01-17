const { sequelize } = require('../src/config/connectDB');
const Review = require('../src/models/reviewModel');

async function syncReviewTable() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync only the Review model
        console.log('Syncing "Review" model...');
        await Review.sync({ alter: true });
        console.log('Review table synced successfully.');

    } catch (error) {
        console.error('Unable to sync table:', error);
    } finally {
        await sequelize.close();
    }
}

syncReviewTable();
