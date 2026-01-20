const db = require('../src/models');
const { User, Role } = db;

async function debugLogin() {
    try {
        console.log("Connecting to DB...");
        await db.sequelize.authenticate();
        console.log("Connected.");

        const email = "tranvanquockhanh123@gmail.com";
        // Using the email visible in the screenshot

        console.log(`Attempting to find User with email: ${email}`);

        // Simulate the exact query from authController.js
        const user = await User.findOne({
            where: { email: email },
            include: { model: Role, as: "role" },
        });

        if (!user) {
            console.log("User not found.");
            return;
        }

        console.log("User found:", user.ho_ten);
        console.log("User Role:", user.role ? user.role.ten_vai_tro : "No Role");
        console.log("Password hash:", user.mat_khau);

        // Test password comparison (assuming password is '123456' or similar, we just want to see if method exists)
        // Note: We don't know the real password, but we can check if comparePassword exists and runs without erroring (even if it returns false)
        if (typeof user.comparePassword === 'function') {
            console.log("Testing comparePassword method...");
            const isMatch = await user.comparePassword("123456");
            console.log("Password match result:", isMatch);
        } else {
            console.error("ERROR: comparePassword method missing on user instance!");
        }

    } catch (error) {
        console.error("DEBUG ERROR:");
        console.error(error);
        const fs = require('fs');
        fs.writeFileSync('auth_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } finally {
        await db.sequelize.close();
    }
}

debugLogin();
