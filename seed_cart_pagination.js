
const { sequelize, User, Product, Cart, CartItem, Category } = require('./src/models');

async function seedCart() {
    try {
        await sequelize.sync(); // Ensure tables exist

        // 0. Ensure Category exists
        let category = await Category.findOne();
        if (!category) {
            console.log("No category found. Creating dummy category...");
            category = await Category.create({
                ten_danh_muc: 'Danh mục Test'
            });
        }

        // 1. Get a user
        let user = await User.findOne();
        if (!user) {
            console.log("No user found. Creating a test user...");
            user = await User.create({
                email: 'testuser@example.com',
                password: 'password123',
                role: 'customer'
            });
        }
        console.log(`Using user: ${user.email} (ID: ${user.id})`);

        // 2. Get or Create Cart
        let [cart, created] = await Cart.findOrCreate({
            where: { user_id: user.id }
        });
        console.log(`Cart ID: ${cart.id}`);

        // 3. Clear existing items
        await CartItem.destroy({ where: { cart_id: cart.id } });
        console.log("Cleared existing cart items.");

        // 4. Ensure we have enough products
        let products = await Product.findAll({ limit: 20 });
        if (products.length < 15) {
            console.log(`Only found ${products.length} products. Creating dummy products...`);
            const needed = 15 - products.length;
            for (let i = 0; i < needed; i++) {
                await Product.create({
                    ten_sach: `Sách Test Pagination ${i + 1}`,
                    gia_bia: 50000 + (i * 1000),
                    danh_muc_id: 1, // Assuming category 1 exists, otherwise might error if FK constraint
                    so_luong_ton_kho: 100,
                    img: '/images/placeholder.png'
                });
            }
            products = await Product.findAll({ limit: 20 });
        }

        // 5. Add 15 items to cart
        console.log(`Adding items to cart...`);
        for (let i = 0; i < 15; i++) {
            if (i >= products.length) break;
            await CartItem.create({
                cart_id: cart.id,
                product_id: products[i].id,
                so_luong: 1
            });
        }

        console.log("✅ Successfully added 15 items to cart.");
        console.log(`Please login as '${user.email}' (or your current user if IDs match) to verify pagination.`);

    } catch (error) {
        console.error("Error seeding cart:", error);
    } finally {
        await sequelize.close();
    }
}

seedCart();
