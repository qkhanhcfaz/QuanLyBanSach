const { sequelize } = require('../src/config/connectDB');
const User = require('../src/models/userModel');
const Role = require('../src/models/roleModel');
const bcrypt = require('bcryptjs');

// Re-establish associations
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

const debugLogin = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const email = 'tranvanquockhanh123@gmail.com';
        const passwordInput = '123456';

        console.log(`\n🔍 Finding user: ${email}...`);
        const user = await User.findOne({
            where: { email },
            include: { model: Role, as: 'role' },
        });

        if (!user) {
            console.error('❌ User NOT FOUND in database.');
            return;
        }

        console.log('✅ User found:');
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Stored Hash: ${user.mat_khau}`);
        console.log(`   - Role ID: ${user.role_id}`);
        if (user.role) {
            console.log(`   - Role Name: ${user.role.ten_quyen}`);
        } else {
            console.error('❌ Role data missing (Association failed or Role not found).');
        }

        console.log('\n🔐 Testing Password Comparison...');
        const isMatch = await bcrypt.compare(passwordInput, user.mat_khau);

        console.log(`   - Input: ${passwordInput}`);
        console.log(`   - Compare Result: ${isMatch}`);

        if (isMatch) {
            console.log('\n🎉 LOGIN SHOULD SUCCEED (Credentials valid).');
        } else {
            console.error('\n❌ LOGIN FAILS: Password does not match.');

            // Try hashing '123456' again to see what it looks like
            const newHash = await bcrypt.hash(passwordInput, 10);
            console.log(`   - Expected Hash Format (example): ${newHash}`);
        }

    } catch (error) {
        console.error('❌ Error during simulation:', error);
    } finally {
        await sequelize.close();
    }
};

debugLogin();
