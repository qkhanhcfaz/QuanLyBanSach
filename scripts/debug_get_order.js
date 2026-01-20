const { sequelize } = require('../src/config/connectDB');
const { Order, User, OrderItem, Product } = require('../src/models');

const debugGetOrder = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const orderId = 15; // Based on the user's log (Order.id = '15')
        console.log(`👉 Finding Order ID: ${orderId}`);

        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "ho_ten", "email", "so_dien_thoai"], // Check if `so_dien_thoai` exists in User model?
                },
                {
                    model: OrderItem,
                    as: "orderItems",
                    include: [{ model: Product, as: "product" }],
                },
            ],
        });

        if (order) {
            console.log('✅ Order found:', order.id);
            console.log('   User:', order.user ? order.user.email : 'NULL');
            console.log('   Items:', order.orderItems.length);
        } else {
            console.log('❌ Order NOT found');
        }

    } catch (error) {
        console.error('❌ Error in findByPk:', error);
    } finally {
        await sequelize.close();
    }
};

debugGetOrder();
