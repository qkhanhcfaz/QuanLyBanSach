const express = require("express");
const router = express.Router();

// Hàm helper để gọi API bên ngoài
const fetchExternalApi = async (url, res) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    // API esgoo.net trả về { error: 0, error_text: "...", data_name: "...", data: [...] }
    // Frontend của ta mong đợi cấu trúc tương tự, nên ta trả về nguyên văn
    res.json(data);
  } catch (error) {
    console.error("Error fetching external province API:", error);
    res.status(500).json({
      error: 1,
      error_text: "Lỗi kết nối đến server dữ liệu địa chính",
      data: [],
    });
  }
};

// 1. Lấy danh sách Tỉnh / Thành phố
// GET /api/provinces
router.get("/", async (req, res) => {
  const url = "https://esgoo.net/api-tinhthanh/1/0.htm";
  await fetchExternalApi(url, res);
});

// 2. Lấy danh sách Quận / Huyện theo Tỉnh
// GET /api/provinces/districts/:provinceId
router.get("/districts/:provinceId", async (req, res) => {
  const { provinceId } = req.params;
  const url = `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`;
  await fetchExternalApi(url, res);
});

// 3. Lấy danh sách Phường / Xã theo Quận
// GET /api/provinces/wards/:districtId
router.get("/wards/:districtId", async (req, res) => {
  const { districtId } = req.params;
  const url = `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`;
  await fetchExternalApi(url, res);
});

module.exports = router;
