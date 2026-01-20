const { sequelize } = require("../src/config/connectDB");

const fixOrderColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB.");

    // Check if column exists
    const [results] = await sequelize.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name='orders' AND column_name='sdt_nguoi_nhan';`,
    );

    if (results.length === 0) {
      console.log("Column sdt_nguoi_nhan does not exist. Adding it...");
      await sequelize.query(
        'ALTER TABLE "orders" ADD COLUMN "sdt_nguoi_nhan" VARCHAR(20) NULL;',
      );
      console.log("Added sdt_nguoi_nhan column.");
    } else {
      console.log("Column sdt_nguoi_nhan exists. Altering to allow NULL...");
      await sequelize.query(
        'ALTER TABLE "orders" ALTER COLUMN "sdt_nguoi_nhan" DROP NOT NULL;',
      );
      console.log("Altered sdt_nguoi_nhan to allow NULL.");
    }
  } catch (error) {
    console.error("Error fixing DB:", error);
  } finally {
    process.exit();
  }
};

fixOrderColumn();
