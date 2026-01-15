const getDashboardStats = async (req, res) => {
  try {
    // --- MOCK DATA ---
    // Trong thực tế, chúng ta sẽ query DB để lấy số liệu thật
    // Nhưng hiện tại do thiếu Model Order, ta dùng dữ liệu giả để Dashboard chạy được.

    const revenueByMonth = [
      { year: 2026, month: 1, total: "15000000" },
      { year: 2025, month: 12, total: "22000000" },
      { year: 2025, month: 11, total: "18500000" },
    ];

    const topSellingProducts = [
      { product: { ten_sach: "Đắc Nhân Tâm" }, total_sold: 120 },
      { product: { ten_sach: "Nhà Giả Kim" }, total_sold: 95 },
      { product: { ten_sach: "Tư Duy Nhanh Chậm" }, total_sold: 80 },
      { product: { ten_sach: "Chí Phèo" }, total_sold: 60 },
      { product: { ten_sach: "Harry Potter" }, total_sold: 45 },
    ];

    const topCustomers = [
      { user: { ho_ten: "Nguyễn Văn A" }, order_count: 15 },
      { user: { ho_ten: "Trần Thị B" }, order_count: 12 },
      { user: { ho_ten: "Lê Văn C" }, order_count: 10 },
      { user: { ho_ten: "Phạm Thị D" }, order_count: 8 },
      { user: { ho_ten: "Hoàng Văn E" }, order_count: 7 },
    ];

    res.json({
      revenueByMonth,
      topSellingProducts,
      topCustomers,
    });
  } catch (error) {
    console.error("Lỗi Dashboard:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
};

module.exports = {
  getDashboardStats,
};
