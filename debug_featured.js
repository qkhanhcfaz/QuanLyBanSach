const { sequelize } = require("./src/config/connectDB");
const db = require("./src/models");

async function checkFeatured() {
  try {
    await sequelize.authenticate();

    console.log("--- FEATURED CATEGORIES ---");
    const featured = await db.Category.findAll({
      where: { is_featured: true },
      include: [
        {
          model: db.Product,
          as: "products",
          attributes: ["id"],
        },
      ],
    });
    featured.forEach((c) => {
      console.log(
        `[x] ID: ${c.id} | ${c.ten_danh_muc} | Products: ${c.products.length}`,
      );
    });

    console.log("\n--- ALL CATEGORIES ---");
    const allCats = await db.Category.findAll({
      attributes: ["id", "ten_danh_muc", "is_featured"],
      order: [["id", "ASC"]],
    });
    allCats.forEach((c) => {
      console.log(
        `[${c.is_featured ? "x" : " "}] ID: ${c.id} | ${c.ten_danh_muc}`,
      );
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

checkFeatured();
