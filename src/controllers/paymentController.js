const { Order } = require("../models");
const vnpayService = require("../services/vnpayService");

const vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = req.query;
    const { isSuccess, orderId } = vnpayService.verifyReturnUrl(vnp_Params);

    // vnp_TxnRef (orderId) có thể có dạng "123" hoặc "ORDER_123_TIMESTAMP" nếu dùng logic giống MoMo
    // Nhưng ở orderController mình đang gửi orderId là "id" của Order (newOrder.id) -> là số PK.
    // Nếu vnpayService.createPaymentUrl dùng orderId thô thì ok.

    if (isSuccess) {
      // Tìm đơn hàng và cập nhật trạng thái
      // Vì orderId gửi qua VNPay là newOrder.id (PK)
      const order = await Order.findByPk(orderId);

      if (order) {
        order.trang_thai_thanh_toan = true;
        // Có thể cập nhật trang_thai_don_hang = 'confirmed' nếu muốn
        // order.trang_thai_don_hang = 'confirmed';
        await order.save();
      }

      // Redirect về trang thành công
      return res.redirect("/checkout-success");
    } else {
      // Redirect về trang thất bại
      return res.redirect("/checkout-fail");
    }
  } catch (error) {
    console.error("Lỗi xử lý vnpay_return:", error);
    return res.redirect("/checkout-fail");
  }
};

module.exports = {
  vnpayReturn,
};
