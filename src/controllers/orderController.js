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

module.exports = {
  getAllOrders,
  getOrderById,
};
