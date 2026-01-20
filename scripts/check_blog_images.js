const db = require('../src/models');

async function checkBlogImages() {
    try {
        const posts = await db.Post.findAll();
        console.log('--- BLOG POSTS ---');
        posts.forEach(p => {
            console.log(JSON.stringify({
                id: p.id,
                title: p.tieu_de,
                hinh_anh: p.hinh_anh
            }, null, 2));
        });
        console.log('------------------');
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBlogImages();
