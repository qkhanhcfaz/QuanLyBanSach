const express = require('express');
const router = express.Router();
const { Cart, CartDetail, Product, User } = require('../models');

// Helper function to get or create a default user for the demo
async function getOrCreateDefaultUser() {
    let user = await User.findByPk(1);
    if (!user) {
        user = await User.create({
            username: 'demo_user',
            password: 'password123', // In real app, hash this!
            email: 'demo@example.com',
            role: 'user'
        });
    }
    return user;
}

// === LẤY GIỎ HÀNG (GET) ===
router.get('/', async (req, res) => {
    try {
        const user = await getOrCreateDefaultUser();

        const cart = await Cart.findOne({
            where: { userId: user.id },
            include: [
                {
                    model: CartDetail,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        if (!cart) {
            return res.json({ items: [] });
        }

        return res.json(cart);
    } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
        return res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng" });
    }
});

// === THÊM SẢN PHẨM VÀO GIỎ HÀNG (POST) ===
router.post('/', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validation cơ bản
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Thiếu productId hoặc quantity" });
        }

        const user = await getOrCreateDefaultUser();

        // 1. Tìm hoặc tạo giỏ hàng cho user
        let [cart] = await Cart.findOrCreate({
            where: { userId: user.id },
            defaults: { userId: user.id }
        });

        // 2. Kiểm tra xem sản phẩm đã có trong giỏ chưa
        let cartItem = await CartDetail.findOne({
            where: {
                cartId: cart.id,
                productId: productId
            }
        });

        if (cartItem) {
            // Nếu có rồi thì cộng thêm số lượng
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            // Nếu chưa có thì tạo mới
            await CartDetail.create({
                cartId: cart.id,
                productId: productId,
                quantity: parseInt(quantity)
            });
        }

        return res.status(200).json({
            message: "Đã thêm vào giỏ hàng thành công!",
            productId,
            quantity
        });

    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        return res.status(500).json({ message: "Lỗi server khi thêm giỏ hàng" });
    }
});

// === CẬP NHẬT SỐ LƯỢNG (PUT) ===
router.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Số lượng không hợp lệ" });
        }

        const user = await getOrCreateDefaultUser();

        // Tìm item trong giỏ hàng của user này (để đảm bảo bảo mật)
        const cartItem = await CartDetail.findOne({
            where: { id: itemId },
            include: [{
                model: Cart,
                as: 'cart',
                where: { userId: user.id }
            }]
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        cartItem.quantity = parseInt(quantity);
        await cartItem.save();

        return res.json({ message: "Cập nhật thành công!" });

    } catch (error) {
        console.error("Lỗi cập nhật giỏ hàng:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

// === XÓA SẢN PHẨM (DELETE) ===
router.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const user = await getOrCreateDefaultUser();

        const cartItem = await CartDetail.findOne({
            where: { id: itemId },
            include: [{
                model: Cart,
                as: 'cart',
                where: { userId: user.id }
            }]
        });

        if (!cartItem) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }

        await cartItem.destroy();

        return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });

    } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
