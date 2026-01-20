const db = require('../src/models');

async function checkBlogContent() {
    try {
        const posts = await db.Post.findAll();
        console.log('--- BLOG POSTS CONTENT ---');
        posts.forEach(p => {
            console.log(`ID: ${p.id}`);
            console.log(`Title: ${p.tieu_de}`);
            console.log(`Summary (tom_tat): '${p.tom_tat}'`);
            console.log('---');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBlogContent();
