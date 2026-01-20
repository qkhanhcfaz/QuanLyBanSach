const { sequelize } = require('../src/config/connectDB');
const User = require('../src/models/userModel');
const Role = require('../src/models/roleModel');

// Re-establish associations as they are usually done in models/index.js
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

const testLoginQuery = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const email = 'tranvanquockhanh123@gmail.com'; // Use the email from the screenshot

        console.log('⏳ Attempting to run User.findOne with Role include...');
        const user = await User.findOne({
            where: { email },
            include: { model: Role, as: 'role' },
        });

        if (user) {
            console.log('✅ Query SUCCESS!');
            console.log('User found:', user.toJSON());
        } else {
            console.log('✅ Query SUCCESS but User not found (this is fine, schema is correct).');
        }

    } catch (error) {
        console.error('❌ Query FAILED with error:');
        console.error(error);
        if (error.original) {
            console.error('Original DB Error:', error.original);
        }
    } finally {
        await sequelize.close();
    }
};

testLoginQuery();
