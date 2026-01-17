// [CODE MỚI] Import Cart, CartItem để xử lý đặt hàng
const {
  Order,
  User,
  OrderItem,
  Product,
  Cart,
  CartItem,
} = require("../models");
const { Op } = require("sequelize");

/**
 * @description     Tạo đơn hàng mới (Checkout)
 * @route           POST /api/orders
 * @access          Private
 */
const createOrder = async (req, res) => {
  try {
    const {
      ten_nguoi_nhan,
      sdt_nguoi_nhan,
      email_nguoi_nhan,
      dia_chi_giao_hang,
      ghi_chu_khach_hang,
      phuong_thuc_thanh_toan,
    } = req.body;

    // 1. Lấy giỏ hàng của user
    const userId = req.user.id;
    const cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // 2. Tính toán tổng tiền
    let tong_tien_hang = 0;
    const phi_van_chuyen = 30000;
    const orderItemsData = [];

    for (const item of cart.items) {
      // Kiểm tra tồn kho (nếu cần chặt chẽ hơn)
      if (item.product.so_luong_ton_kho < item.so_luong) {
        return res.status(400).json({
          message: `Sản phẩm ${item.product.ten_sach} không đủ hàng.`,
        });
      }

      tong_tien_hang += Number(item.product.gia_bia) * item.so_luong;

      orderItemsData.push({
        product_id: item.product_id,
        so_luong_dat: item.so_luong,
        don_gia: item.product.gia_bia,
        thanh_tien: Number(item.product.gia_bia) * item.so_luong,
      });
    }

    const tong_thanh_toan = tong_tien_hang + phi_van_chuyen;

    // 3. Tạo đơn hàng (Order)
    const newOrder = await Order.create({
      user_id: userId,
      ten_nguoi_nhan,
      email_nguoi_nhan,
      sdt_nguoi_nhan,
      dia_chi_giao_hang,
      ghi_chu_khach_hang,
      tong_tien_hang,
      phi_van_chuyen,
      tong_thanh_toan,
      phuong_thuc_thanh_toan,
      trang_thai_don_hang: "pending",
      trang_thai_thanh_toan: false, // Mặc định là chưa thanh toán
    });

    // 4. Tạo chi tiết đơn hàng (OrderItem)
    const orderItemsWithId = orderItemsData.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }));
    await OrderItem.bulkCreate(orderItemsWithId);

    // 5. Trừ tồn kho và Xóa sản phẩm trong giỏ
    for (const item of cart.items) {
      // Trừ kho
      const product = await Product.findByPk(item.product_id);
      if (product) {
        product.so_luong_ton_kho -= item.so_luong;
        product.da_ban += item.so_luong; // Cập nhật số lượng đã bán
        await product.save();
      }
    }
    // Xóa giỏ hàng
    await CartItem.destroy({ where: { cart_id: cart.id } });

    res.status(201).json({
      message: "Đặt hàng thành công",
      id: newOrder.id,
      // Nếu có thanh toán online trả về url ở đây
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng." });
  }
};

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
  createOrder,
};
