// File: /src/seeders/seedOrders.js
const { Order, OrderItem, Product, User } = require('../models');

const seedOrders = async () => {
    try {
        // 1️⃣ Lấy user thường (role_id = 2)
        const user = await User.findOne({ where: { role_id: 2 } });
        if (!user) {
            console.log('❌ Không tìm thấy user để tạo đơn hàng');
            return;
        }

        // 2️⃣ Lấy danh sách sản phẩm
        const products = await Product.findAll();
        if (products.length < 3) {
            console.log('❌ Chưa đủ sản phẩm để seed order');
            return;
        }

        // 3️⃣ Tạo 3 đơn hàng đã giao
        const orders = await Order.bulkCreate([
            {
                user_id: user.id,
                tong_tien: 254000,
                trang_thai_don_hang: 'delivered',
                dia_chi_giao_hang: 'TP. Hồ Chí Minh'
            },
            {
                user_id: user.id,
                tong_tien: 189000,
                trang_thai_don_hang: 'delivered',
                dia_chi_giao_hang: 'Hà Nội'
            },
            {
                user_id: user.id,
                tong_tien: 320000,
                trang_thai_don_hang: 'shipping',
                dia_chi_giao_hang: 'Đà Nẵng'
            }
        ], { returning: true });

        // 4️⃣ Tạo chi tiết đơn hàng (OrderItem)
        await OrderItem.bulkCreate([
            {
                order_id: orders[0].id,
                product_id: products[0].id,
                so_luong_dat: 2,
                don_gia: products[0].gia_bia
            },
            {
                order_id: orders[0].id,
                product_id: products[1].id,
                so_luong_dat: 1,
                don_gia: products[1].gia_bia
            },
            {
                order_id: orders[1].id,
                product_id: products[2].id,
                so_luong_dat: 1,
                don_gia: products[2].gia_bia
            },
            {
                order_id: orders[2].id,
                product_id: products[0].id,
                so_luong_dat: 3,
                don_gia: products[0].gia_bia
            }
        ]);

        console.log('✅ Seed Orders & OrderItems thành công (TOP bán chạy có dữ liệu)');
    } catch (error) {
        console.error('❌ Lỗi khi seed orders:', error);
    }
};

module.exports = seedOrders;
