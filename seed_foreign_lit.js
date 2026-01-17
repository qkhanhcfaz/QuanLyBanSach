const { sequelize } = require('./src/config/connectDB');
const { Product, Category } = require('./src/models');

const seedForeignLiterature = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Target Category: Văn học Nước ngoài (ID: 5)
        const targetId = 5;
        let cat = await Category.findByPk(targetId);

        if (cat) {
            console.log(`Found Category ${targetId}: ${cat.ten_danh_muc}`);
            if (cat.ten_danh_muc !== 'Văn học Nước ngoài') {
                cat.ten_danh_muc = 'Văn học Nước ngoài';
                await cat.save();
                console.log(`Updated Category ${targetId} name to 'Văn học Nước ngoài'.`);
            }
        } else {
            cat = await Category.create({
                id: targetId,
                ten_danh_muc: 'Văn học Nước ngoài'
            });
            console.log(`Created Category ${targetId} ('Văn học Nước ngoài').`);
        }

        const products = [
            {
                ten_sach: 'Hoàng Tử Bé',
                tac_gia: 'Antoine de Saint-Exupéry',
                nha_xuat_ban: 'NXB Kim Đồng',
                nam_xuat_ban: 2022,
                gia_bia: 75000,
                so_luong_ton_kho: 150,
                so_trang: 100,
                mo_ta_ngan: 'Một cuốn sách diệu kỳ dành cho trẻ em và những ai từng là trẻ em, về tình yêu và trách nhiệm.',
                danh_muc_id: targetId,
                img: 'https://upload.wikimedia.org/wikipedia/vi/8/87/Hoangtube_bia.jpg',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Rừng Na Uy',
                tac_gia: 'Haruki Murakami',
                nha_xuat_ban: 'NXB Hội Nhà Văn',
                nam_xuat_ban: 2021,
                gia_bia: 120000,
                so_luong_ton_kho: 80,
                so_trang: 550,
                mo_ta_ngan: 'Tiểu thuyết lãng mạn pha lẫn u sầu, kể về những mất mát và sự trưởng thành của tuổi trẻ.',
                danh_muc_id: targetId,
                img: '/images/rung-na-uy.png',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Hai Số Phận',
                tac_gia: 'Jeffrey Archer',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2020,
                gia_bia: 165000,
                so_luong_ton_kho: 100,
                so_trang: 700,
                mo_ta_ngan: 'Câu chuyện đầy kịch tính về hai người đàn ông sinh ra cùng này khác nhau về số phận nhưng cuộc đời họ đan xen.',
                danh_muc_id: targetId,
                img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1559186637i/46115939.jpg',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Bố Già',
                tac_gia: 'Mario Puzo',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2019,
                gia_bia: 150000,
                so_luong_ton_kho: 120,
                so_trang: 500,
                mo_ta_ngan: 'Tác phẩm đỉnh cao về thế giới Mafia Mỹ, câu chuyện về gia đình Corleone đầy quyền lực.',
                danh_muc_id: targetId,
                img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1564057863i/47306316.jpg',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Không Gia Đình',
                tac_gia: 'Hector Malot',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2020,
                gia_bia: 110000,
                so_luong_ton_kho: 90,
                so_trang: 600,
                mo_ta_ngan: 'Cuộc phiêu lưu đầy gian nan nhưng cũng đầy tình người của cậu bé Remi và gánh xiếc rong.',
                danh_muc_id: targetId,
                img: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1487474472i/34330107.jpg',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Ông Già Và Biển Cả',
                tac_gia: 'Ernest Hemingway',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2018,
                gia_bia: 60000,
                so_luong_ton_kho: 70,
                so_trang: 120,
                mo_ta_ngan: 'Cuộc chiến không cân sức giữa ông già lão ngư và con cá kiếm khổng lồ giữa biển khơi.',
                danh_muc_id: targetId,
                img: 'https://upload.wikimedia.org/wikipedia/vi/2/29/Onggiavabienca.jpg',
                product_type: 'print_book'
            },
            {
                ten_sach: 'Đồi Gió Hú',
                tac_gia: 'Emily Brontë',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2021,
                gia_bia: 95000,
                so_luong_ton_kho: 60,
                so_trang: 400,
                mo_ta_ngan: 'Một câu chuyện tình yêu dữ dội, hoang dại và đầy ám ảnh trên vùng đồng cỏ nước Anh.',
                danh_muc_id: targetId,
                img: '/images/doi-gio-hu.png',
                product_type: 'print_book'
            }
        ];

        for (const p of products) {
            const exists = await Product.findOne({ where: { ten_sach: p.ten_sach } });
            if (!exists) {
                await Product.create(p);
                console.log(`Created product: ${p.ten_sach}`);
            } else {
                console.log(`Product already exists: ${p.ten_sach}`);
                // Ensure correct category
                if (exists.danh_muc_id !== targetId) {
                    exists.danh_muc_id = targetId;
                    await exists.save();
                    console.log(`-> Updated category for ${p.ten_sach} to ${targetId}`);
                }
            }
        }

        console.log('✅ Seeded Foreign Literature successfully.');

    } catch (error) {
        console.error('Error seeding foreign literature:', error);
    } finally {
        await sequelize.close();
    }
};

seedForeignLiterature();
