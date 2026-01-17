const db = require('./src/models');
const { Order, OrderItem, Product, User, sequelize } = db;

const seedOrders = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối CSDL thành công.');

        // Sync models để tạo bảng nếu chưa có
        await sequelize.sync();
        console.log('✅ Đã đồng bộ Database.');

        // Xóa dữ liệu cũ (reset)
        await OrderItem.destroy({ where: {} });
        await Order.destroy({ where: {} });
        console.log('🧹 Đã xóa dữ liệu đơn hàng cũ.');

        // 1. Lấy User và Product
        const users = await User.findAll();
        const products = await Product.findAll();

        if (users.length === 0) {
            console.error('❌ Cần ít nhất 1 User để tạo đơn hàng.');
            return;
        }
        if (products.length === 0) {
            console.error('❌ Cần ít nhất 1 Product để tạo đơn hàng.');
            return;
        }

        const user = users[0];
        console.log(`👤 Tạo đơn hàng cho User: ${user.email}`);

        // 2. Data mẫu
        const ordersData = [
            {
                status: 'pending',
                paymentStatus: false,
                paymentMethod: 'COD',
                note: 'Giao giờ hành chính',
                items: [products[0]]
            },
            {
                status: 'confirmed',
                paymentStatus: false,
                paymentMethod: 'Banking',
                note: 'Gọi trước khi giao',
                items: [products[products.length - 1], products[0]]
            },
            {
                status: 'delivered',
                paymentStatus: true,
                paymentMethod: 'Momo',
                note: 'Để ở lễ tân',
                items: [products[0]]
            }
        ];

        // 3. Tạo đơn hàng
        for (const [index, data] of ordersData.entries()) {
            // Tính tổng tiền
            let totalAmount = 0;
            const orderItemsData = data.items.map(product => {
                const quantity = Math.floor(Math.random() * 2) + 1;
                const price = parseFloat(product.gia_bia); // FIX: gia -> gia_bia
                totalAmount += quantity * price;
                return {
                    product_id: product.id,
                    so_luong_dat: quantity,
                    don_gia: price
                };
            });

            const shippingFee = 30000;
            const finalAmount = totalAmount + shippingFee;

            const newOrder = await Order.create({
                user_id: user.id,
                trang_thai_don_hang: data.status,
                phuong_thuc_thanh_toan: data.paymentMethod,
                trang_thai_thanh_toan: data.paymentStatus,
                ten_nguoi_nhan: user.ho_ten || 'Nguyen Van A',
                email_nguoi_nhan: user.email,
                so_dt_nguoi_nhan: user.so_dien_thoai || '0123456789',
                dia_chi_giao_hang: user.dia_chi || '123 Đường ABC, HCM',
                ghi_chu_khach_hang: data.note,
                tong_tien_hang: totalAmount,
                phi_van_chuyen: shippingFee,
                tong_thanh_toan: finalAmount
            });

            // Tạo Order Items
            for (const item of orderItemsData) {
                await OrderItem.create({
                    order_id: newOrder.id,
                    ...item
                });
            }

            console.log(`✅ Đã tạo đơn hàng #${index + 1} - Status: ${data.status} - Total: ${finalAmount}`);
        }

        console.log('🎉 Hoàn tất tạo 3 đơn hàng mẫu!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi seed orders:', error);
        process.exit(1);
    }
};

seedOrders();
