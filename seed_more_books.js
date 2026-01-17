const { sequelize } = require('./src/config/connectDB');
const { Product } = require('./src/models');

const seedMoreBooks = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        const economicsId = 1;
        const selfHelpId = 3;

        const newProducts = [
            // --- SÁCH KINH TẾ ---
            {
                ten_sach: 'Kinh Tế Học Hài Hước',
                tac_gia: 'Steven D. Levitt, Stephen J. Dubner',
                nha_xuat_ban: 'NXB Nhã Nam',
                nam_xuat_ban: 2020,
                gia_bia: 135000,
                so_luong_ton_kho: 80,
                so_trang: 300,
                mo_ta_ngan: 'Cuốn sách lật tẩy những mặt khuất của thế giới thực bằng lăng kính kinh tế học đầy thú vị.',
                danh_muc_id: economicsId,
                img: '/images/kinh-te-hoc-hai-huoc.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: 'Nhà Đầu Tư Thông Minh',
                tac_gia: 'Benjamin Graham',
                nha_xuat_ban: 'NXB Trẻ',
                nam_xuat_ban: 2019,
                gia_bia: 180000,
                so_luong_ton_kho: 60,
                so_trang: 640,
                mo_ta_ngan: 'Cuốn sách "gối đầu giường" cho mọi nhà đầu tư chứng khoán giá trị.',
                danh_muc_id: economicsId,
                img: '/images/nha-dau-tu-thong-minh.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: 'Chiến Tranh Tiền Tệ',
                tac_gia: 'Song Hongbing',
                nha_xuat_ban: 'NXB Lao Động Xã Hội',
                nam_xuat_ban: 2021,
                gia_bia: 115000,
                so_luong_ton_kho: 100,
                so_trang: 450,
                mo_ta_ngan: 'Những âm mưu tài chính đằng sau các sự kiện lịch sử thế giới.',
                danh_muc_id: economicsId,
                img: '/images/chien-tranh-tien-te.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: 'Tỷ Phú Bán Giày',
                tac_gia: 'Tony Hsieh',
                nha_xuat_ban: 'NXB Thái Hà',
                nam_xuat_ban: 2018,
                gia_bia: 90000,
                so_luong_ton_kho: 50,
                so_trang: 300,
                mo_ta_ngan: 'Câu chuyện về Zappos và văn hóa doanh nghiệp hướng tới hạnh phúc.',
                danh_muc_id: economicsId,
                img: '/images/ty-phu-ban-giay.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },

            // --- PHÁT TRIỂN BẢN THÂN ---
            {
                ten_sach: 'Đánh Thức Con Người Phi Thường Trong Bạn',
                tac_gia: 'Anthony Robbins',
                nha_xuat_ban: 'NXB Tổng Hợp TP.HCM',
                nam_xuat_ban: 2020,
                gia_bia: 160000,
                so_luong_ton_kho: 90,
                so_trang: 520,
                mo_ta_ngan: 'Phương pháp kiểm soát cảm xúc, cơ thể, các mối quan hệ và tài chính.',
                danh_muc_id: selfHelpId,
                img: '/images/danh-thuc-con-nguoi-phi-thuong-trong-ban.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: '7 Thói Quen Để Thành Đạt',
                tac_gia: 'Stephen R. Covey',
                nha_xuat_ban: 'NXB Trẻ',
                nam_xuat_ban: 2019,
                gia_bia: 145000,
                so_luong_ton_kho: 70,
                so_trang: 480,
                mo_ta_ngan: 'Những nguyên tắc vàng giúp bạn đạt được hiệu quả cá nhân và nghề nghiệp.',
                danh_muc_id: selfHelpId,
                img: '/images/bay-thoi-quen-de-thanh-dat.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: 'Đời Thay Đổi Khi Chúng Ta Thay Đổi',
                tac_gia: 'Andrew Matthews',
                nha_xuat_ban: 'NXB Trẻ',
                nam_xuat_ban: 2021,
                gia_bia: 60000,
                so_luong_ton_kho: 120,
                so_trang: 180,
                mo_ta_ngan: 'Những bài học nhẹ nhàng nhưng sâu sắc giúp bạn sống vui vẻ và tích cực hơn.',
                danh_muc_id: selfHelpId,
                img: '/images/doi-thay-doi-khi-chung-ta-thay-doi.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            },
            {
                ten_sach: 'Quẳng Gánh Lo Đi Và Vui Sống',
                tac_gia: 'Dale Carnegie',
                nha_xuat_ban: 'NXB First News',
                nam_xuat_ban: 2018,
                gia_bia: 80000,
                so_luong_ton_kho: 110,
                so_trang: 320,
                mo_ta_ngan: 'Cẩm nang giúp bạn đánh bại nỗi lo âu để tận hưởng cuộc sống trọn vẹn.',
                danh_muc_id: selfHelpId,
                img: '/images/quang-ganh-lo-di-va-vui-song.png',
                product_type: 'print_book',
                da_ban: Math.floor(Math.random() * 500)
            }
        ];

        let count = 0;
        for (const p of newProducts) {
            const exists = await Product.findOne({ where: { ten_sach: p.ten_sach } });
            if (!exists) {
                await Product.create(p);
                console.log(`Created: ${p.ten_sach}`);
                count++;
            } else {
                console.log(`Skipped (already exists): ${p.ten_sach}`);
            }
        }

        console.log(`✅ Successfully added ${count} new books.`);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        await sequelize.close();
    }
};

seedMoreBooks();
