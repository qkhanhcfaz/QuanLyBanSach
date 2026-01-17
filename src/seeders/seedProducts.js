// File: /src/seeders/seedProducts.js
const { Product } = require('../models');

const seedProducts = async () => {
    try {
        await Product.bulkCreate([
            {
                ten_sach: 'Chí Phèo',
                tac_gia: 'Nam Cao',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2018,
                gia_bia: 65000,
                so_luong_ton_kho: 50,
                so_trang: 160,
                mo_ta_ngan: 'Tác phẩm hiện thực xuất sắc phản ánh xã hội nông thôn Việt Nam trước Cách mạng.',
                danh_muc_id: 4, // Văn học Việt Nam
                img: '/images/chi-pheo.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Lão Hạc',
                tac_gia: 'Nam Cao',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2019,
                gia_bia: 55000,
                so_luong_ton_kho: 40,
                so_trang: 140,
                mo_ta_ngan: 'Câu chuyện cảm động về người nông dân nghèo giàu lòng tự trọng.',
                danh_muc_id: 4,
                img: '/images/lao-hac.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Đắc Nhân Tâm',
                tac_gia: 'Dale Carnegie',
                nha_xuat_ban: 'NXB Tổng Hợp TP.HCM',
                nam_xuat_ban: 2020,
                gia_bia: 150000,
                so_luong_ton_kho: 60,
                so_trang: 320,
                mo_ta_ngan: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử.',
                danh_muc_id: 3, // Phát triển bản thân
                img: '/images/dac-nhan-tam.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Nhà Giả Kim',
                tac_gia: 'Paulo Coelho',
                nha_xuat_ban: 'NXB Lao Động',
                nam_xuat_ban: 2021,
                gia_bia: 99000,
                so_luong_ton_kho: 70,
                so_trang: 228,
                mo_ta_ngan: 'Hành trình theo đuổi ước mơ và khám phá chính mình.',
                danh_muc_id: 5, // Văn học nước ngoài
                img: '/images/nha-gia-kim.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Tư Duy Nhanh Và Chậm',
                tac_gia: 'Daniel Kahneman',
                nha_xuat_ban: 'NXB Lao Động',
                nam_xuat_ban: 2022,
                gia_bia: 189000,
                so_luong_ton_kho: 45,
                so_trang: 612,
                mo_ta_ngan: 'Phân tích hai hệ thống tư duy ảnh hưởng đến quyết định của con người.',
                danh_muc_id: 3,
                img: '/images/tu-duy-nhanh-va-cham.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Cha Giàu Cha Nghèo',
                tac_gia: 'Robert T. Kiyosaki',
                nha_xuat_ban: 'NXB Trẻ',
                nam_xuat_ban: 2020,
                gia_bia: 120000,
                so_luong_ton_kho: 55,
                so_trang: 336,
                mo_ta_ngan: 'Tư duy tài chính cá nhân và con đường tự do tài chính.',
                danh_muc_id: 2, // Kinh tế
                img: '/images/cha-giau-cha-ngheo.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Dế Mèn Phiêu Lưu Ký',
                tac_gia: 'Tô Hoài',
                nha_xuat_ban: 'NXB Kim Đồng',
                nam_xuat_ban: 2017,
                gia_bia: 75000,
                so_luong_ton_kho: 80,
                so_trang: 200,
                mo_ta_ngan: 'Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.',
                danh_muc_id: 4,
                img: '/images/de-men-phieu-luu-ky.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Bố Già',
                tac_gia: 'Mario Puzo',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2019,
                gia_bia: 135000,
                so_luong_ton_kho: 30,
                so_trang: 448,
                mo_ta_ngan: 'Tiểu thuyết nổi tiếng về thế giới mafia Ý tại Mỹ.',
                danh_muc_id: 5,
                img: '/images/bo-gia.png',
                product_type: 'print_book'
            }
        ]);

        console.log('✅ Seed sản phẩm THÀNH CÔNG (dữ liệu thật)');
    } catch (error) {
        console.error('❌ Lỗi khi seed sản phẩm:', error);
    }
};

module.exports = seedProducts;
