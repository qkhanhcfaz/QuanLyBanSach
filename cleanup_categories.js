const { sequelize } = require('./src/config/connectDB');
const { Product, Category } = require('./src/models');

const removeVangHocGeneric = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        const genericId = 2; // Văn Học
        const economicId = 1; // Sách Kinh Tế

        const genericCat = await Category.findByPk(genericId);
        
        if (!genericCat) {
            console.log('Category "Văn Học" (ID 2) does not exist or already deleted.');
        } else {
            console.log(`Found Category to delete: ${genericCat.ten_danh_muc}`);
            
            // Move products to Economics
            const [updated] = await Product.update(
                { danh_muc_id: economicId },
                { where: { danh_muc_id: genericId } }
            );
            console.log(`Moved ${updated} products from 'Văn Học' to 'Sách Kinh Tế'.`);

            // Delete category
            await genericCat.destroy();
            console.log('Deleted Category "Văn Học".');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

removeVangHocGeneric();
