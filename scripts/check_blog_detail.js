const db = require('../src/models');

async function checkBlogDetail() {
    try {
        const posts = await db.Post.findAll();
        posts.forEach(p => {
            console.log(`ID: ${p.id}`);
            console.log(`NOI DUNG: '${p.noi_dung}'`);
            console.log('---');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBlogDetail();
