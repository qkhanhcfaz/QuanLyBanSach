const { sequelize } = require('./src/config/connectDB');
const { Product, Category } = require('./src/models');

const fixDuplicateCategories = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // ID to remove: 4 (The initial "Văn học Việt Nam")
        // ID to keep: 31 (The one currently used by homepage and recent seeds)
        const oldId = 4;
        const newId = 31;

        const oldCat = await Category.findByPk(oldId);
        const newCat = await Category.findByPk(newId);

        if (!oldCat || !newCat) {
            console.log('One of the categories does not exist. Aborting.');
            return;
        }

        console.log(`Moving products from '${oldCat.ten_danh_muc}' (ID: ${oldId}) to '${newCat.ten_danh_muc}' (ID: ${newId})...`);

        // Update products
        const [updatedCount] = await Product.update(
            { danh_muc_id: newId },
            { where: { danh_muc_id: oldId } }
        );

        console.log(`Moved ${updatedCount} products.`);

        // Delete old category
        await oldCat.destroy();
        console.log(`Deleted Category ID ${oldId}.`);

        console.log('✅ Fix complete.');

    } catch (error) {
        console.error('❌ Error fixing categories:', error);
    } finally {
        await sequelize.close();
    }
};

fixDuplicateCategories();
