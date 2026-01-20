const { sequelize } = require('./src/config/connectDB');
const { Category } = require('./src/models');

const listCategories = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const categories = await Category.findAll();
        console.log('--- CATEGORY LIST ---');
        categories.forEach(c => {
            console.log(`ID: ${c.id} | Name: ${c.ten_danh_muc}`);
        });
        console.log('---------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

listCategories();
