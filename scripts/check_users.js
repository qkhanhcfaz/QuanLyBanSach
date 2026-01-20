const db = require('../src/models');

async function checkUsers() {
    try {
        const users = await db.User.findAll();
        console.log('--- USERS LIST ---');
        users.forEach(u => {
            console.log(JSON.stringify({
                id: u.id,
                ho_ten: u.ho_ten,
                ten_dang_nhap: u.ten_dang_nhap,
                so_dien_thoai: u.so_dien_thoai,
                email: u.email
            }, null, 2));
        });
        console.log('------------------');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkUsers();
