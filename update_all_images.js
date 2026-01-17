const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'book_store_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '123456',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sach: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING }
}, { tableName: 'products', timestamps: true });

const imageMapping = {
    'chien-tranh-tien-te.png': ['Chiến tranh tiền tệ', 'Chiến Tranh Tiền Tệ'],
    'hai-so-phan.png': ['Hai Số Phận', 'Hai số phận'],
    'hoang-tu-be.png': ['Hoàng Tử Bé', 'Hoàng tử bé'],
    'khong-gia-dinh.png': ['Không Gia Đình', 'Không gia đình'],
    'kinh-te-hoc-hai-huoc.png': ['Kinh Tế Học Hài Hước', 'Kinh tế học hài hước'],
    'nha-dau-tu-thong-minh.png': ['Nhà Đầu Tư Thông Minh', 'Nhà đầu tư thông minh'],
    'ong-gia-va-bien-ca.png': ['Ông Già Và Biển Cả', 'Ông già và biển cả'],
    'ty-phu-ban-giay.png': ['Tỷ Phú Bán Giày', 'Tỷ phú bán giày'],
    'bo-gia.png': ['Bố Già', 'Bố già'],
    'cha-giau-cha-ngheo.png': ['Cha Giàu Cha Nghèo', 'Cha giàu cha nghèo'],
    'dac-nhan-tam.png': ['Đắc Nhân Tâm', 'Đắc nhân tâm'],
    'de-men-phieu-luu-ky.png': ['Dế Mèn Phiêu Lưu Ký', 'Dế mèn phiêu lưu ký'],
    'nha-gia-kim.png': ['Nhà Giả Kim', 'Nhà giả kim'],
    'sherlock-holmes.png': ['Sherlock Holmes', 'Thám tử Sherlock Holmes'],
    'tu-duy-nhanh-va-cham.png': ['Tư Duy Nhanh Và Chậm', 'Tư duy nhanh và chậm'],
    'tuoi-tho-du-doi.png': ['Tuổi Thơ Dữ Dội', 'Tuổi thơ dữ dội'],
    'kheo-an-noi.jpg': ['Khéo ăn nói sẽ có được thiên hạ', 'Khéo Ăn Nói Sẽ Có Được Thiên Hạ'],
    'bay-thoi-quen-de-thanh-dat.png': ['7 Thói Quen Để Thành Đạt', '7 thói quen để thành đạt'],
    'danh-thuc-con-nguoi-phi-thuong-trong-ban.png': ['Đánh Thức Con Người Phi Thường Trong Bạn', 'Đánh thức con người phi thường trong bạn'],
    'doi-thay-doi-khi-chung-ta-thay-doi.png': ['Đời Thay Đổi Khi Chúng Ta Thay Đổi', 'Đời thay đổi khi chúng ta thay đổi'],
    'quang-ganh-lo-di-va-vui-song.png': ['Quẳng Gánh Lo Đi Và Vui Sống', 'Quẳng gánh lo đi và vui sống']
};

async function updateImages() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        for (const [filename, titles] of Object.entries(imageMapping)) {
            const imagePath = `/images/${filename}`;
            // Use Op.or inside the where clause properly
            const [updatedCount] = await Product.update(
                { img: imagePath },
                {
                    where: {
                        ten_sach: {
                            [Sequelize.Op.or]: titles.map(t => ({ [Sequelize.Op.iLike]: `%${t}%` }))
                        }
                    }
                }
            );

            if (updatedCount > 0) {
                console.log(`Updated ${updatedCount} products for image: ${filename}`);
            } else {
                console.log(`No products found for image: ${filename} (Titles: ${titles.join(', ')})`);
            }
        }

    } catch (error) {
        console.error('Error updating images:', error);
    } finally {
        await sequelize.close();
    }
}

updateImages();
