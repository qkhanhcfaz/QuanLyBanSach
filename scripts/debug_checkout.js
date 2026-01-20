const axios = require('axios');
const { sequelize } = require('../src/config/connectDB');

const API_URL = 'http://localhost:8080/api';
const EMAIL = 'tranvanquockhanh123@gmail.com'; // User we reset password for
const PASS = '123456';

const debugCheckout = async () => {
    try {
        // 1. Skip Login - Generate Token Manually
        console.log('👉 Generating Token Manually (Skipping Login API)...');
        const jwt = require('jsonwebtoken');
        const { User } = require('../src/models');

        // Fetch user to get ID and Role (to be safe)
        const user = await User.findOne({ where: { email: EMAIL } });
        if (!user) throw new Error('User not found for token generation');

        const token = jwt.sign(
            { id: user.id, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );
        console.log('✅ Token generated manually.');
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Add item to Cart
        console.log('\n👉 Adding item to cart...');
        // Need a product ID. From previous steps, ID 3 (Chí Phèo) exists.
        try {
            await axios.post(`${API_URL}/cart`, {
                product_id: 3,
                so_luong: 1
            }, { headers });
            console.log('✅ Added "Chí Phèo" to cart.');
        } catch (e) {
            console.log('⚠️ Failed to add to cart (maybe already exists):', e.response?.data?.message || e.message);
        }

        // 3. Checkout (Create Order)
        console.log('\n👉 Attempting Checkout...');
        const checkoutData = {
            ten_nguoi_nhan: "Test User",
            sdt_nguoi_nhan: "0909000111",
            dia_chi_giao_hang: "123 Test Street",
            email_nguoi_nhan: "test@example.com",
            ghi_chu_khach_hang: "Test order debug",
            phuong_thuc_thanh_toan: "COD",
            ma_khuyen_mai: "",
            selectedCartItemIds: [] // Empty means all items in cart? Controller says if empty/null, it takes all.
        };

        const orderRes = await axios.post(`${API_URL}/orders`, checkoutData, { headers });
        console.log('✅ Checkout Successful!', orderRes.data);

    } catch (error) {
        console.error('❌ Checkout Failed!');
        const fs = require('fs');
        const logPath = './logs/checkout_error.json';

        // Ensure logs dir exists
        if (!fs.existsSync('./logs')) { fs.mkdirSync('./logs'); }

        let errorData = {};
        if (error.response) {
            console.error('Status:', error.response.status);
            errorData = error.response.data;
        } else {
            console.error('Error:', error.message);
            errorData = { message: error.message, stack: error.stack };
        }

        fs.writeFileSync(logPath, JSON.stringify(errorData, null, 2));
        console.log(`DETAILS WRITTEN TO ${logPath}`);
    }
};

debugCheckout();
