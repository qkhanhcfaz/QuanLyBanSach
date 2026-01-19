const { sequelize } = require('../src/config/connectDB');
const bcrypt = require('bcryptjs');

const resetAllPasswords = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB.');

        const plainPassword = '123456';

        // Generate hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        console.log(`Generated Hash for '123456': ${hashedPassword}`);

        // Update ALL users
        const [results, metadata] = await sequelize.query(
            `UPDATE users SET mat_khau = :pass`,
            {
                replacements: { pass: hashedPassword }
            }
        );

        console.log(`✅ Successfully reset passwords for ALL users. Row count affected: ${metadata.rowCount || metadata}`);

    } catch (error) {
        console.error('❌ Error resetting passwords:', error);
    } finally {
        await sequelize.close();
    }
};

resetAllPasswords();
