const db = require('../src/models');
const { Order, OrderItem } = db;

async function debugProductLoading() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        // Simulate a user ID and product ID (replace with valid ones from your DB if needed)
        // We know user_id=5 exists from previous logs. 
        // Product ID can be arbitrary for checking schema errors.
        const userId = 5;
        const productId = 3;

        console.log(`Attempting Order.count for user ${userId} and product ${productId}...`);

        // Exact query from viewController.js
        const deliveredOrderCount = await Order.count({
            where: {
                user_id: userId,
                trang_thai_don_hang: 'delivered'
            },
            include: [{
                model: OrderItem,
                as: 'orderItems',
                where: { product_id: productId }
            }]
        });

        console.log("Query Successful!");
        console.log("Order Count:", deliveredOrderCount);

    } catch (error) {
        console.error("DEBUG ERROR:");
        // console.error(error);
        const fs = require('fs');
        fs.writeFileSync('product_loading_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.log("Error details written to product_loading_error.log");
    } finally {
        await db.sequelize.close();
    }
}

debugProductLoading();
