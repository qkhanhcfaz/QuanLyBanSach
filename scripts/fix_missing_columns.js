const { sequelize } = require("../src/config/connectDB");

async function fixDatabase() {
  try {
    console.log("🔄 Đang kết nối CSDL và cập nhật cột thiếu...");
    await sequelize.authenticate();
    console.log("✅ Kết nối thành công.");

    // Thêm cột 'views' vào bảng 'products'
    await sequelize.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "views" INTEGER DEFAULT 0;`,
    );
    console.log("✅ Đã thêm cột 'views'.");

    // Thêm cột 'da_ban' vào bảng 'products'
    await sequelize.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "da_ban" INTEGER DEFAULT 0;`,
    );
    console.log("✅ Đã thêm cột 'da_ban'.");

    // Thêm cột 'ebook_url' vào bảng 'products' (nếu thiếu)
    await sequelize.query(
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ebook_url" VARCHAR(255);`,
    );
    console.log("✅ Đã thêm cột 'ebook_url'.");

    // Thêm cột 'img' vào bảng 'categories' (nếu thiếu)
    await sequelize.query(
      `ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "img" VARCHAR(255);`,
    );
    console.log("✅ Đã thêm cột 'img' vào bảng categories.");

    console.log("🎉 Cập nhật CSDL hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật CSDL:", error);
    process.exit(1);
  }
}

fixDatabase();
