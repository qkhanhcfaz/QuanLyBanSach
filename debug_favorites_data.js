const db = require('./src/models');
const { Favorite, User, Product } = db;

async function checkFavorites() {
    try {
        await db.sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Check all favorites
        const favorites = await Favorite.findAll();
        console.log(`Total favorites found: ${favorites.length}`);

        if (favorites.length > 0) {
            console.log("Sample favorites:");
            favorites.forEach(f => {
                console.log(`- User: ${f.user_id}, Product: ${f.product_id}`);
            });
        } else {
            console.log("No favorites found in database.");
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.sequelize.close();
    }
}

checkFavorites();
