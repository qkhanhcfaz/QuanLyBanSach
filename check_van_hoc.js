const { sequelize } = require('./src/config/connectDB');
const { Product, Category } = require('./src/models');

const checkVanHoc = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // ID 2 corresponds to "Văn Học" based on previous checks
        const catId = 2;
        const cat = await Category.findByPk(catId);

        if (!cat) {
            console.log('Category "Văn Học" (ID 2) does not exist.');
            return;
        }

        console.log(`Found Category: ${cat.ten_danh_muc} (ID: ${cat.id})`);

        // Count products
        const productCount = await Product.count({ where: { danh_muc_id: catId } });
        console.log(`Number of products in "Văn Học": ${productCount}`);

        if (productCount > 0) {
            console.log('Sample products:');
            const products = await Product.findAll({ where: { danh_muc_id: catId }, limit: 5 });
            products.forEach(p => console.log(`- ${p.ten_sach}`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkVanHoc();
