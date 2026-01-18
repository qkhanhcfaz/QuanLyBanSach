const {
    Order,
    User,
    OrderItem,
    Cart,
    CartItem,
    Product // <--- Thêm Product
} = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/connectDB'); // <--- Thêm sequelize để dùng transaction

/**
 * Tạo đơn hàng mới (User)
 * POST /api/orders
 */
const createOrder = async (req, res) => {
    const t = await sequelize.transaction(); // Bắt đầu transaction
    try {
        const {
            ten_nguoi_nhan,
            sdt_nguoi_nhan,
            dia_chi_giao_hang,
            email_nguoi_nhan,
            ghi_chu_khach_hang,
            phuong_thuc_thanh_toan,
            ma_khuyen_mai
        } = req.body;
        const userId = req.user.id;

        // 1. Lấy giỏ hàng của user
        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            await t.rollback();
            return res.status(400).json({ message: 'Giỏ hàng trống.' });
        }

        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.id },
            include: [{ model: Product, as: 'product' }]
        });

        if (!cartItems || cartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Giỏ hàng trống.' });
        }

        let tong_tien = 0;
        const orderItemsData = [];

        // 2. Duyệt qua từng sản phẩm để check kho và tính tiền
        for (const item of cartItems) {
            const product = item.product;
            if (!product) continue;

            // Check tồn kho lần cuối (quan trọng)
            if (item.so_luong > product.so_luong_ton_kho) {
                await t.rollback();
                return res.status(400).json({ 
                    message: `Sản phẩm "${product.ten_sach}" đã hết hàng hoặc không đủ số lượng.` 
                });
            }

            tong_tien += parseFloat(product.gia_bia) * item.so_luong;

            // Chuẩn bị dữ liệu OrderItem
            orderItemsData.push({
                product_id: product.id,
                so_luong_dat: item.so_luong, // Fix: so_luong -> so_luong_dat
                don_gia: product.gia_bia      // Fix: gia -> don_gia
            });

            // TRỪ TỒN KHO
            await product.decrement('so_luong_ton_kho', { by: item.so_luong, transaction: t });
            
            // TĂNG SỐ LƯỢNG ĐÃ BÁN (Optional)
            await product.increment('da_ban', { by: item.so_luong, transaction: t });
        }

        // 3. Tính phí ship và giảm giá (giả định)
        const phi_van_chuyen = 30000;
        let giam_gia = 0;
        // Logic check ma_khuyen_mai ở đây nếu có...

        const tong_thanh_toan = tong_tien + phi_van_chuyen - giam_gia; // Fix: tong_thu_thuc -> tong_thanh_toan

        // 4. Tạo Order
        const newOrder = await Order.create({
            user_id: userId,
            ten_nguoi_nhan,
            so_dt_nguoi_nhan,
            dia_chi_giao_hang,
            email_nguoi_nhan,
            ghi_chu_khach_hang,
            phuong_thuc_thanh_toan,
            tong_tien_hang: tong_tien,
            phi_van_chuyen,
            giam_gia,
            tong_thanh_toan, // Fix: tong_thu_thuc -> tong_thanh_toan
            trang_thai_don_hang: 'pending', // Chờ xác nhận
            trang_thai_thanh_toan: false
        }, { transaction: t });

        // 5. Tạo OrderItems
        for (const itemData of orderItemsData) {
            await OrderItem.create({
                ...itemData,
                order_id: newOrder.id
            }, { transaction: t });
        }

        // 6. Xóa giỏ hàng sau khi đặt thành công
        await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });

        await t.commit(); // Lưu thay đổi vào DB

        res.status(201).json({
            message: 'Đặt hàng thành công',
            id: newOrder.id
        });

    } catch (error) {
        await t.rollback();
        console.error('Lỗi createOrder:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng.' });
    }
};

/**
 * Lấy danh sách đơn hàng (Admin)
 * GET /api/orders
 */
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, status } = req.query;
        const offset = (page - 1) * limit;

        const whereCondition = {};

        // Lọc theo trạng thái
        if (status) {
            whereCondition.trang_thai_don_hang = status;
        }

        // Tìm kiếm (theo ID hoặc tên người nhận)
        if (keyword) {
            whereCondition[Op.or] = [
                // { id: keyword }, // Nếu ID là UUID thì phải chính xác, nhưng search thường là like.
                // Vì ID là UUID nên tìm like sẽ hơi khó nếu user không gõ đủ.
                // Tạm thời tìm theo tên người nhận hoặc số điện thoại
                { ten_nguoi_nhan: { [Op.iLike]: `%${keyword}%` } },
                { so_dt_nguoi_nhan: { [Op.iLike]: `%${keyword}%` } },
                { email_nguoi_nhan: { [Op.iLike]: `%${keyword}%` } }
            ];

            // Nếu keyword là số thì tìm theo ID
            // (Số nguyên dương)
            if (!isNaN(keyword) && Number.isInteger(parseFloat(keyword))) {
                whereCondition[Op.or].push({ id: keyword });
            }
        }

        const { count, rows } = await Order.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: 'user', attributes: ['id', 'ho_ten'] }
            ],
            order: [['createdAt', 'DESC']], // Mới nhất lên đầu
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            orders: rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalOrders: count
        });

    } catch (error) {
        console.error('Lỗi get all orders:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
    }
};

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Cập nhật trạng thái
        order.trang_thai_don_hang = status;

        // Nếu trạng thái là 'confirmed' hoặc 'delivered', có thể cần xử lý thêm logic
        // Ví dụ: cập nhật kho, gửi email... (chưa làm ở bước này)

        if (status === 'delivered') {
            order.trang_thai_thanh_toan = true; // Giả sử giao hàng thành công là đã thanh toán
        }

        await order.save();

        res.json({
            message: 'Cập nhật trạng thái thành công',
            order
        });

    } catch (error) {
        console.error('Lỗi update order status:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật đơn hàng' });
    }
};

module.exports = {
    updateOrderStatus,
    getAllOrders,
    createOrder // <--- Xuất hàm mới
};
