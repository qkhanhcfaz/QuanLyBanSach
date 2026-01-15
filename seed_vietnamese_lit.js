const { sequelize } = require('./src/config/connectDB');
const { Product, Category } = require('./src/models');

const seedVietnameseLiterature = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Ensure Category having ID 31 matches "Văn học Việt Nam"
        const targetId = 31;
        const cat = await Category.findByPk(targetId);

        if (cat) {
            console.log(`Found Category ${targetId}: ${cat.ten_danh_muc}`);
            if (cat.ten_danh_muc !== 'Văn học Việt Nam') {
                cat.ten_danh_muc = 'Văn học Việt Nam';
                await cat.save();
                console.log(`Updated Category ${targetId} name to 'Văn học Việt Nam'.`);
            }
        } else {
            // Force create with specific ID
            await Category.create({
                id: targetId,
                ten_danh_muc: 'Văn học Việt Nam'
            });
            console.log(`Created Category ${targetId} ('Văn học Việt Nam').`);
        }

        // 2. Add sample products
        const products = [
            {
                ten_sach: 'Số Đỏ',
                gia_bia: 85000,
                gia_goc: 60000,
                so_luong_ton: 100,
                mo_ta: 'Một tác phẩm trào phúng xuất sắc của Vũ Trọng Phụng.',
                tac_gia: 'Vũ Trọng Phụng',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2023,
                danh_muc_id: targetId,
                img: '/images/so-do.png'
            },
            {
                ten_sach: 'Dế Mèn Phiêu Lưu Ký',
                gia_bia: 65000,
                gia_goc: 40000,
                so_luong_ton: 200,
                mo_ta: 'Tác phẩm văn học thiếu nhi kinh điển của Tô Hoài.',
                tac_gia: 'Tô Hoài',
                nha_xuat_ban: 'NXB Kim Đồng',
                nam_xuat_ban: 2022,
                danh_muc_id: targetId,
                img: '/images/de-men-phieu-luu-ky.png'
            },
            {
                ten_sach: 'Tắt Đèn',
                gia_bia: 70000,
                gia_goc: 45000,
                so_luong_ton: 150,
                mo_ta: 'Tiểu thuyết hiện thực phê phán của Ngô Tất Tố.',
                tac_gia: 'Ngô Tất Tố',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2021,
                danh_muc_id: targetId,
                img: '/images/tat-den.png'
            },
            {
                ten_sach: 'Chí Phèo',
                gia_bia: 55000,
                gia_goc: 35000,
                so_luong_ton: 120,
                mo_ta: 'Tuyển tập truyện ngắn Nam Cao.',
                tac_gia: 'Nam Cao',
                nha_xuat_ban: 'NXB Văn Học',
                nam_xuat_ban: 2020,
                danh_muc_id: targetId,
                img: '/images/chi-pheo.png'
            },
            {
                ten_sach: 'Tuổi Thơ Dữ Dội',
                gia_bia: 120000,
                gia_goc: 90000,
                so_luong_ton: 80,
                mo_ta: 'Hồi ức về các em bé trinh sát của Phùng Quán.',
                tac_gia: 'Phùng Quán',
                nha_xuat_ban: 'NXB Kim Đồng',
                nam_xuat_ban: 2023,
                danh_muc_id: targetId,
                img: '/images/tuoi-tho-du-doi.png'
            }
        ];

        for (const p of products) {
            // Check if exists
            const exists = await Product.findOne({ where: { ten_sach: p.ten_sach } });
            if (!exists) {
                await Product.create(p);
                console.log(`Created product: ${p.ten_sach}`);
            } else {
                console.log(`Product already exists: ${p.ten_sach}`);
                // Update category if wrong
                if (exists.danh_muc_id !== targetId) {
                    exists.danh_muc_id = targetId;
                    await exists.save();
                    console.log(`-> Updated category for ${p.ten_sach} to ${targetId}`);
                }
            }
        }

        console.log('✅ Finished seeding.');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await sequelize.close();
    }
};

seedVietnameseLiterature();
