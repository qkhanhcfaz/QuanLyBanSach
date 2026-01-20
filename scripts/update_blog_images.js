const db = require('../src/models');

async function updateBlogImages() {
    try {
        const post1 = await db.Post.findByPk(1);
        if (post1) {
            post1.hinh_anh = '/images/blog/dac-nhan-tam.jpg';
            await post1.save();
            console.log('Updated Post 1 image');
        }

        const post2 = await db.Post.findByPk(2);
        if (post2) {
            post2.hinh_anh = '/images/blog/nha-gia-kim.jpg';
            await post2.save();
            console.log('Updated Post 2 image');
        }

        console.log('Done updating blog images');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateBlogImages();
