const db = require('../src/models');

async function listSlides() {
    try {
        await db.sequelize.authenticate();
        const slides = await db.Slideshow.findAll();
        console.log("Slides:", slides.map(s => ({ id: s.id, link: s.link_to }))); // Corrected column name
    } catch (e) { console.error(e); }
    finally { await db.sequelize.close(); }
}
listSlides();
