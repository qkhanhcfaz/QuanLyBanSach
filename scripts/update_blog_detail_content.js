const db = require('../src/models');

async function updateBlogDetailContent() {
    try {
        const post1 = await db.Post.findByPk(1);
        if (post1) {
            post1.noi_dung = `
        <p>Đọc sách là một thói quen tuyệt vời giúp mở mang kiến thức và nuôi dưỡng tâm hồn. Dưới đây là những lợi ích của việc đọc sách mỗi ngày:</p>
        <ul>
            <li><strong>Mở rộng kiến thức:</strong> Sách là kho tàng tri thức vô tận của nhân loại viao.</li>
            <li><strong>Cải thiện khả năng tập trung:</strong> Khi đọc sách, bạn phải tập trung vào cốt truyện và ngôn từ.</li>
            <li><strong>Giảm căng thẳng:</strong> Một cuốn sách hay có thể đưa bạn đến một thế giới khác, giúp quên đi lo âu.</li>
            <li><strong>Cải thiện trí nhớ:</strong> Việc ghi nhớ nhân vật và tình tiết giúp rèn luyện não bộ.</li>
        </ul>
        <p>Hãy dành ít nhất 30 phút mỗi ngày để đọc sách nhé!</p>
      `;
            await post1.save();
            console.log('Updated Post 1 full content');
        }

        const post2 = await db.Post.findByPk(2);
        if (post2) {
            post2.noi_dung = `
        <p>Năm 2026 chứng kiến sự lên ngôi của nhiều tác phẩm văn học xuất sắc. Dưới đây là top 5 cuốn sách bạn không nên bỏ qua:</p>
        <ol>
            <li><strong>Nhà Giả Kim:</strong> Một câu chuyện về hành trình theo đuổi ước mơ.</li>
            <li><strong>Đắc Nhân Tâm:</strong> Nghệ thuật thu phục lòng người.</li>
            <li><strong>Tư Duy Nhanh Và Chậm:</strong> Hiểu về cách não bộ ra quyết định.</li>
            <li><strong>Sapiens: Lược Sử Loài Người:</strong> Câu chuyện về lịch sử nhân loại.</li>
            <li><strong>Atomic Habits:</strong> Thay đổi tói quen, thay đổi cuộc đời.</li>
        </ol>
        <p>Bạn đã đọc bao nhiêu cuốn trong danh sách này? Hãy ghé BookZone để tìm mua ngay nhé!</p>
      `;
            await post2.save();
            console.log('Updated Post 2 full content');
        }

        console.log('Done updating blog details');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateBlogDetailContent();
