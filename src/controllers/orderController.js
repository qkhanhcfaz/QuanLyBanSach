const {
    Order,
    User
} = require('../models');
const { Op } = require('sequelize');

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
    getAllOrders
};
