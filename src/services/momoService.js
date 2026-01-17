const crypto = require("crypto");

// THÔNG TIN CẤU HÌNH MOMO (Được lấy từ biến môi trường)
// Lấy từ: https://developers.momo.vn/v3/docs/payment/api/collection-link/
const MOMO_CONFIG = {
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  partnerCode: process.env.MOMO_PARTNER_CODE,
  redirectUrl: process.env.SERVER_URL + "/checkout/result", // Chuyển hướng sau khi thanh toán
  ipnUrl: process.env.SERVER_URL + "/api/payment/momo-ipn", // Server MoMo gọi vào
  requestType: "payWithATM",
  extraData: "",
  orderGroupId: "",
  autoCapture: true,
  lang: "vi",
};

/**
 * Tạo URL thanh toán MoMo
 * @param {Object} orderInfo
 * @param {string} orderInfo.orderId - Mã đơn hàng (duy nhất)
 * @param {number} orderInfo.amount - Số tiền thanh toán
 * @param {string} orderInfo.orderInfo - Thông tin đơn hàng hiển thị
 */
const createPaymentUrl = async ({ orderId, amount, orderInfo }) => {
  const {
    accessKey,
    secretKey,
    partnerCode,
    redirectUrl,
    ipnUrl,
    requestType,
    extraData,
  } = MOMO_CONFIG;

  // requestId phải là duy nhất cho mỗi request
  const requestId = orderId + new Date().getTime();

  // Chuỗi cần ký (Signature) - CỰC KỲ QUAN TRỌNG: Phải đúng thứ tự key alphabet
  // format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Tạo signature bằng HMAC SHA256
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  // Payload gửi đi
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Book Store",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: "vi",
    requestType: requestType,
    autoCapture: true,
    extraData: extraData,
    signature: signature,
  });

  // Gọi API MoMo
  try {
    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: requestBody,
      },
    );

    const result = await response.json();
    return result; // Sẽ chứa payUrl
  } catch (error) {
    console.error("Lỗi gọi API MoMo:", error);
    throw error;
  }
};

module.exports = {
  createPaymentUrl,
};
