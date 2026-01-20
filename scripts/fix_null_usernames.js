const db = require('../src/models');

async function fixNullUsernames() {
    try {
        const users = await db.User.findAll();
        for (const user of users) {
            if (!user.ten_dang_nhap) {
                const newUsername = user.email.split('@')[0];
                console.log(`Fixing User ID ${user.id}: Setting username to ${newUsername}`);
                user.ten_dang_nhap = newUsername;
                await user.save();
            }
        }
        console.log('Done fixing usernames.');
    } catch (error) {
        console.error('Error:', error);
    }
}

fixNullUsernames();
