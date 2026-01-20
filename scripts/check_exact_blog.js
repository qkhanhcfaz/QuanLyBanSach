const db = require('../src/models');

async function checkExact() {
    try {
        const posts = await db.Post.findAll();
        posts.forEach(p => {
            console.log(`ID: ${p.id}`);
            console.log(`Title: ${p.tieu_de}`);
            console.log(`Image: '${p.hinh_anh}'`); // Quotes to see whitespace
            console.log('---');
        });
    } catch (err) {
        console.error(err);
    }
}

checkExact();
