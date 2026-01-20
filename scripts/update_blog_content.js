const db = require('../src/models');

async function updateBlogContent() {
    try {
        const post1 = await db.Post.findByPk(1);
        if (post1) {
            post1.tom_tat = 'Đọc sách không chỉ giúp mở mang kiến thức mà còn giảm căng thẳng, cải thiện trí nhớ và tăng khả năng tập trung.';
            await post1.save();
            console.log('Updated Post 1 summary');
        }

        const post2 = await db.Post.findByPk(2);
        if (post2) {
            post2.tom_tat = 'Khám phá những cuốn sách bán chạy nhất năm 2026, từ văn học, kinh tế đến kỹ năng sống, được độc giả yêu thích.';
            await post2.save();
            console.log('Updated Post 2 summary');
        }

        console.log('Done updating blog summaries');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateBlogContent();
