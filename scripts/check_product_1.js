const db = require('../src/models');

async function checkProduct1() {
    try {
        console.log("Connecting...");
        await db.sequelize.authenticate();

        console.log("Checking Product ID 1...");
        // Check with paranoid: false to see if it was soft deleted
        const product = await db.Product.findByPk(1, { paranoid: false });

        if (product) {
            console.log("Product Found:", product.toJSON());
            if (product.deletedAt) {
                console.log(">> WARNING: Product is SOFT DELETED (deletedAt is set).");
            } else {
                console.log(">> Product is Active.");
            }
        } else {
            console.log(">> Product ID 1 does NOT exist in database.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await db.sequelize.close();
    }
}

checkProduct1();
