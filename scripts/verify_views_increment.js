const db = require('../src/models');

async function verifyViewIncrement() {
    try {
        console.log("Connecting...");
        await db.sequelize.authenticate();

        const productId = 3; // Use an existing product ID
        const product = await db.Product.findByPk(productId);

        if (!product) {
            console.log("Product not found.");
            return;
        }

        console.log(`Current views for Product ${productId}: ${product.views}`);

        console.log("Incrementing views...");
        await product.increment("views");

        // Re-fetch to confirm
        const updatedProduct = await db.Product.findByPk(productId);
        console.log(`New views for Product ${productId}: ${updatedProduct.views}`);

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await db.sequelize.close();
    }
}

verifyViewIncrement();
