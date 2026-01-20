const { sequelize } = require("./src/config/connectDB");

async function fixDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Add slug column to posts table
    await sequelize.query(
      'ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "slug" VARCHAR(255);',
    );
    console.log('Successfully added "slug" column to "posts" table.');
  } catch (error) {
    console.error("Unable to connect to the database or execute query:", error);
  } finally {
    await sequelize.close();
  }
}

fixDatabase();
