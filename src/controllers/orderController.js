const {
  Order,
  User,
  OrderItem,
  Cart,
  CartItem,
  Product, // <--- Thêm Product
} = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/connectDB"); // <--- Thêm sequelize để dùng transaction

/**
 * Tạo đơn hàng mới (User)
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  const t = await sequelize.transaction(); // Bắt đầu transaction
  try {
    console.log("👉 createOrder Request Body:", JSON.stringify(req.body, null, 2));

    const {
      ten_nguoi_nhan,
      sdt_nguoi_nhan,
      dia_chi_giao_hang,
      email_nguoi_nhan,
      ghi_chu_khach_hang,
      phuong_thuc_thanh_toan,
      ma_khuyen_mai,
      selectedCartItemIds, // <--- Nhận danh sách ID từ client
    } = req.body;
    const userId = req.user.id;

    // 1. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      await t.rollback();
      return res.status(400).json({ message: "Giỏ hàng trống." });
    }

    // Tạo điều kiện query
    const queryOptions = {
      where: { cart_id: cart.id },
      include: [{ model: Product, as: "product" }],
    };

    // Nếu client gửi lên danh sách ID được chọn, thì lọc theo đó
    if (
      selectedCartItemIds &&
      Array.isArray(selectedCartItemIds)
    ) {
      // NGAY CẢ KHI MẢNG RỖNG, ta vẫn set để query trả về rỗng thay vì trả về toàn bộ
      queryOptions.where.id = selectedCartItemIds;
    }

    const cartItems = await CartItem.findAll(queryOptions);

    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào được chọn để thanh toán." });
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
          message: `Sản phẩm "${product.ten_sach}" đã hết hàng hoặc không đủ số lượng.`,
        });
      }

      tong_tien += parseFloat(product.gia_bia) * item.so_luong;

      // Chuẩn bị dữ liệu OrderItem
      orderItemsData.push({
        product_id: product.id,
        so_luong_dat: item.so_luong, // Fix: so_luong -> so_luong_dat
        don_gia: product.gia_bia, // Fix: gia -> don_gia
      });

      // TRỪ TỒN KHO
      await product.decrement("so_luong_ton_kho", {
        by: item.so_luong,
        transaction: t,
      });

      // TĂNG SỐ LƯỢNG ĐÃ BÁN (Optional)
      await product.increment("da_ban", { by: item.so_luong, transaction: t });
    }

    // 3. Tính phí ship và giảm giá
    // MỚI: Miễn phí vận chuyển nếu tổng tiền hàng >= 300.000đ
    const phi_van_chuyen = (tong_tien >= 300000) ? 0 : 30000;
    let giam_gia = 0;
    // Logic check ma_khuyen_mai ở đây nếu có...

    const tong_thanh_toan = tong_tien + phi_van_chuyen - giam_gia; // Fix: tong_thu_thuc -> tong_thanh_toan

    // 4. Tạo Order
    const newOrder = await Order.create(
      {
        user_id: userId,
        ten_nguoi_nhan,
        sdt_nguoi_nhan, // Correct key matches model
        dia_chi_giao_hang,
        email_nguoi_nhan,
        ghi_chu_khach_hang,
        phuong_thuc_thanh_toan,
        tong_tien_hang: tong_tien,
        phi_van_chuyen,
        // giam_gia, // Removed as column does not exist in model
        tong_thanh_toan, // Fix: tong_thu_thuc -> tong_thanh_toan
        trang_thai_don_hang: "pending", // Chờ xác nhận
        trang_thai_thanh_toan: false,
      },
      { transaction: t },
    );

    // 5. Tạo OrderItems
    for (const itemData of orderItemsData) {
      await OrderItem.create(
        {
          ...itemData,
          order_id: newOrder.id,
        },
        { transaction: t },
      );
    }

    // 6. Xóa giỏ hàng sau khi đặt thành công
    // 6. Xóa các sản phẩm đã đặt khỏi giỏ hàng
    // Chỉ xóa những item đã nằm trong cartItems (đã lọc ở trên)
    const orderedItemIds = cartItems.map((item) => item.id);
    if (orderedItemIds.length > 0) {
      await CartItem.destroy({
        where: {
          id: orderedItemIds,
        },
        transaction: t,
      });
    }

    await t.commit(); // Lưu thay đổi vào DB

    res.status(201).json({
      message: "Đặt hàng thành công",
      id: newOrder.id,
    });
  } catch (error) {
    // Chỉ rollback nếu transaction chưa commit/rollback
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error("❌ Lỗi createOrder:", error);
    if (error.original) {
      console.error("❌ Sequelize Error Detail:", error.original);
    }
    res.status(500).json({
      message: "Lỗi server khi tạo đơn hàng: " + error.message,
      stack: error.stack,
    });
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
        { email_nguoi_nhan: { [Op.iLike]: `%${keyword}%` } },
      ];

      // Nếu keyword là số thì tìm theo ID
      // (Số nguyên dương)
      if (!isNaN(keyword) && Number.isInteger(parseFloat(keyword))) {
        whereCondition[Op.or].push({ id: keyword });
      }
    }

    const { count, rows } = await Order.findAndCountAll({
      where: whereCondition,
      include: [{ model: User, as: "user", attributes: ["id", "ho_ten"] }],
      order: [["createdAt", "DESC"]], // Mới nhất lên đầu
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      orders: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalOrders: count,
    });
  } catch (error) {
    console.error("Lỗi get all orders:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
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
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Cập nhật trạng thái
    order.trang_thai_don_hang = status;

    // Nếu trạng thái là 'confirmed' hoặc 'delivered', có thể cần xử lý thêm logic
    // Ví dụ: cập nhật kho, gửi email... (chưa làm ở bước này)

    if (status === "delivered") {
      order.trang_thai_thanh_toan = true; // Giả sử giao hàng thành công là đã thanh toán
    }

    await order.save();

    res.json({
      message: "Cập nhật trạng thái thành công",
      order,
    });
  } catch (error) {
    console.error("Lỗi update order status:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
  }
};

/**
 * Lấy chi tiết đơn hàng (Admin)
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "ho_ten", "email"],
        },
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

    // [DEBUG] Log để kiểm tra type
    console.log(`[AUTH CHECK] OrderUser: ${order.user_id} (${typeof order.user_id}) | RequestUser: ${req.user.id} (${typeof req.user.id}) | Role: ${req.user.role_id}`);

    // [MỚI] Check quyền xem
    // Fix lỗi so sánh type (String vs Number)
    // Nếu không phải Admin (role_id = 1) VÀ không phải chủ đơn hàng -> Chặn
    if (String(req.user.role_id) !== '1' && String(order.user_id) !== String(req.user.id)) {
      console.log('⛔ Truy cập bị từ chối.');
      return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này." });
    }

    res.json(order);
  } catch (error) {
    console.error("Lỗi get order by id:", error);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết đơn hàng" });
  }
};

/**
 * Lấy danh sách đơn hàng của tôi (User)
 * GET /api/orders/myorders
 */
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 5, status } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = { user_id: req.user.id };

    // Lọc theo trạng thái nếu có
    if (status && status !== 'all') {
      if (status === 'pending') {
        // Pending bao gồm cả chờ thanh toán
        whereCondition.trang_thai_don_hang = { [Op.in]: ['pending', 'pending_payment'] };
      } else {
        whereCondition.trang_thai_don_hang = status;
      }
    }

    const { count, rows } = await Order.findAndCountAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    res.json({
      orders: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalOrders: count,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Lỗi get my orders:", error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử đơn hàng" });
  }
};

/**
 * Hủy đơn hàng (User)
 * POST /api/orders/:id/cancel
 */
const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "orderItems" }],
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    // 1. Kiểm tra quyền sở hữu
    if (String(order.user_id) !== String(req.user.id)) {
      await t.rollback();
      return res.status(403).json({ message: "Bạn không có quyền hủy đơn hàng này." });
    }

    // 2. Kiểm tra trạng thái (Chỉ được hủy khi đang chờ xác nhận)
    if (order.trang_thai_don_hang !== "pending" && order.trang_thai_don_hang !== "pending_payment") {
      await t.rollback();
      return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận." });
    }

    // 3. Hoàn lại tồn kho
    for (const item of order.orderItems) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        await product.increment("so_luong_ton_kho", {
          by: item.so_luong_dat,
          transaction: t,
        });
        // Giảm lại số lượng đã bán
        await product.decrement("da_ban", {
          by: item.so_luong_dat,
          transaction: t,
        });
      }
    }

    // 4. Cập nhật trạng thái
    order.trang_thai_don_hang = "cancelled";
    await order.save({ transaction: t });

    await t.commit();
    res.json({ message: "Hủy đơn hàng thành công.", order });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("❌ Lỗi cancelOrder:", error);
    res.status(500).json({ message: "Lỗi server khi hủy đơn hàng: " + error.message });
  }
};

/**
 * Mua lại đơn hàng (User)
 * POST /api/orders/:id/reorder
 * Copy all items from an old order into the current cart
 */
const reorder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Lấy thông tin đơn hàng cũ
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "orderItems" }],
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    // 2. Kiểm tra quyền sở hữu
    if (String(order.user_id) !== String(userId)) {
      await t.rollback();
      return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này." });
    }

    // 3. Kiểm tra trạng thái (Chỉ cho phép mua lại từ đơn đã hủy)
    if (order.trang_thai_don_hang !== "cancelled") {
      await t.rollback();
      return res.status(400).json({ message: "Chỉ có thể mua lại đơn hàng đã hủy." });
    }

    // 4. Kiểm tra tồn kho cho tất cả sản phẩm
    for (const item of order.orderItems) {
      const product = await Product.findByPk(item.product_id);
      if (!product || product.so_luong_ton_kho < item.so_luong_dat) {
        await t.rollback();
        return res.status(400).json({
          message: `Sản phẩm "${product ? product.ten_sach : 'Không xác định'}" không đủ hàng trong kho (Còn lại: ${product ? product.so_luong_ton_kho : 0}).`
        });
      }
    }

    // 5. Trừ kho và cập nhật số lượng đã bán
    for (const item of order.orderItems) {
      const product = await Product.findByPk(item.product_id);
      await product.decrement("so_luong_ton_kho", {
        by: item.so_luong_dat,
        transaction: t,
      });
      await product.increment("da_ban", {
        by: item.so_luong_dat,
        transaction: t,
      });
    }

    // 6. Cập nhật trạng thái đơn hàng về 'pending' (Chờ xác nhận)
    // Cập nhật lại ngày đặt hàng sang hiện tại để đơn hàng mới nhảy lên đầu
    order.trang_thai_don_hang = "pending";
    order.createdAt = new Date();
    await order.save({ transaction: t });

    await t.commit();
    res.json({ message: "Đã đặt lại đơn hàng thành công!", orderId: order.id });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error("❌ Lỗi reorder:", error);
    res.status(500).json({ message: "Lỗi server khi mua lại đơn hàng: " + error.message });
  }
};

module.exports = {
  updateOrderStatus,
  getAllOrders,
  createOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  reorder,
};
