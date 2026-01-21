const { sequelize } = require("../src/config/connectDB");

async function addTrangThaiToReviews() {
  try {
    await sequelize.query(`
      ALTER TABLE reviews
      ADD COLUMN IF NOT EXISTS trang_thai BOOLEAN DEFAULT true;
    `);

    console.log("✅ Đã đảm bảo cột trang_thai tồn tại trong bảng reviews");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi thêm cột trang_thai cho reviews:", error);
    process.exit(1);
  }
}

addTrangThaiToReviews();
