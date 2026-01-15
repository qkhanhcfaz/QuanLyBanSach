const { Order, User, OrderItem, Product } = require("../models");
const { Op } = require("sequelize");

/**
 * @description     Admin: Lấy danh sách tất cả đơn hàng (có Filter, Search, Pagination)
 * @route           GET /api/orders
 * @access          Private/Admin
 */
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, keyword, status } = req.query;

    // 1. Xây dựng điều kiện lọc (Where)
    let whereCondition = {};

    // Lọc theo từ khóa (ID, Tên người nhận)
    if (keyword) {
      whereCondition[Op.or] = [
        // Tìm theo ID (nếu keyword là số)
        ...(Number.isInteger(parseInt(keyword)) ? [{ id: keyword }] : []),
        // Tìm theo tên người nhận
        { ten_nguoi_nhan: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      whereCondition.trang_thai_don_hang = status;
    }

    // 2. Phân trang
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // 3. Truy vấn Database
    const { count, rows } = await Order.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "ho_ten", "email"], // Chỉ lấy thông tin cần thiết
        },
      ],
      order: [["createdAt", "DESC"]], // Mới nhất lên đầu
      limit: limitNum,
      offset: offset,
      distinct: true, // Để count đúng khi có include
    });

    // 4. Trả về kết quả
    res.json({
      orders: rows,
      currentPage: pageNum,
      totalPages: Math.ceil(count / limitNum),
      totalOrders: count,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng." });
  }
};

/**
 * @description     Admin: Lấy chi tiết đơn hàng
 * @route           GET /api/orders/:id
 * @access          Private/Admin
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: "user" },
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(order);
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * @description     Admin: Cập nhật trạng thái đơn hàng
 * @route           PUT /api/orders/:id/status
 * @access          Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // VALIDATION: Chỉ cho phép hủy khi đang chờ hoặc đã xác nhận
    if (status === "cancelled") {
      if (
        order.trang_thai_don_hang !== "pending" &&
        order.trang_thai_don_hang !== "confirmed"
      ) {
        return res.status(400).json({
          message:
            "Không thể hủy đơn hàng đã giao hoặc đang giao. Chỉ hủy được khi chưa xử lý xong.",
        });
      }
    }

    // Cập nhật trạng thái
    order.trang_thai_don_hang = status;

    // Nếu là 'delivered', cập nhật luôn trạng thái thanh toán thành true (nếu chưa)
    if (status === "delivered") {
      order.trang_thai_thanh_toan = true;
    }

    await order.save();

    res.json({ message: "Cập nhật trạng thái thành công!", order });
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
