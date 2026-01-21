const { sequelize } = require('../src/models');

async function addTrangThaiColumn() {
  try {
    console.log('👉 Bắt đầu kiểm tra cột trang_thai...');

    await sequelize.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS trang_thai BOOLEAN DEFAULT true;
    `);

    console.log('✅ Đã đảm bảo cột trang_thai tồn tại trong products');
  } catch (error) {
    console.error('❌ Lỗi khi thêm cột trang_thai:', error);
  } finally {
    await sequelize.close();
  }
}

addTrangThaiColumn();
