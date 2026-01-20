const { sequelize } = require("./src/config/connectDB");
const db = require("./src/models");

async function updateSchema() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // 1. Add column if not exists (already done)

    // 2. Seed some featured categories
    // IDs: 30 (Văn Học Nước Ngoài), 31 (Văn Học Việt Nam), 29 (Đầu Tư Tài Chính - derived from debug)
    const categoriesToFeature = [29, 30, 31];

    // Reset all first
    await db.Category.update({ is_featured: false }, { where: {} });

    // Set specific ones
    await db.Category.update(
      { is_featured: true },
      { where: { id: categoriesToFeature } },
    );

    console.log("Updated categories 29, 30, 31 to be featured.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

updateSchema();
